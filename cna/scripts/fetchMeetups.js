const fs = require('fs');
const path = require('path');

const USAGE = `Usage: node fetchMeetups.js --config <path> --output <path> [--timezone <IANA tz>]

Options:
  -c, --config     Path to JSON config file (required)
  -o, --output     Path to output JSON file (required)
  -t, --timezone   IANA timezone for date/time formatting (default: Europe/Vienna)
  -h, --help       Show this help

Config schema:
  {
    "groups": [
      { "meetupGroup": "<meetup.com group slug>", "chapter": "<chapter folder name>" }
    ]
  }

Per-event output fields (front-matter ready):
  date       YYYY-MM-DD                 (e.g. "2026-05-21")
  timeStart  H:MM am/pm                 (e.g. "5:00 pm")
  timeEnd    H:MM am/pm                 (e.g. "7:00 pm")
  timezone   IANA tz used for formatting
  title      VEVENT SUMMARY
  location   VEVENT LOCATION (raw)
  description VEVENT DESCRIPTION (unescaped)
  url        VEVENT URL
  uid        VEVENT UID
`;

const DEFAULT_TIMEZONE = 'Europe/Vienna';

function parseArgs(argv) {
    const opts = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '-h' || a === '--help') {
            opts.help = true;
        } else if (a === '-c' || a === '--config') {
            opts.config = argv[++i];
        } else if (a === '-o' || a === '--output') {
            opts.output = argv[++i];
        } else if (a === '-t' || a === '--timezone') {
            opts.timezone = argv[++i];
        } else {
            throw new Error(`unknown argument: ${a}`);
        }
    }
    return opts;
}

function decodeXmlEntities(s) {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function extractEventLinks(rssXml) {
    const items = rssXml.match(/<item\b[\s\S]*?<\/item>/g) || [];
    const links = [];
    for (const item of items) {
        const cdataMatch = item.match(/<link>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/link>/);
        const plainMatch = item.match(/<link>([\s\S]*?)<\/link>/);
        const raw = (cdataMatch && cdataMatch[1]) || (plainMatch && plainMatch[1]);
        if (!raw) continue;
        const url = decodeXmlEntities(raw.trim());
        if (url) links.push(url);
    }
    return links;
}

function icalUrlFor(eventUrl) {
    const stripped = eventUrl.replace(/\/+$/, '');
    return `${stripped}/ical`;
}

function unfoldIcal(text) {
    return text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

function unescapeIcalText(s) {
    return s
        .replace(/\\n/g, '\n')
        .replace(/\\N/g, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\');
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function pad4(n) {
    return String(n).padStart(4, '0');
}

function parseDtValue(value, params) {
    const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
    if (dateOnly) {
        return {
            kind: 'date',
            year: +dateOnly[1],
            month: +dateOnly[2],
            day: +dateOnly[3],
            tzid: params.TZID || null,
        };
    }
    const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value);
    if (!m) return null;
    return {
        kind: 'datetime',
        year: +m[1],
        month: +m[2],
        day: +m[3],
        hour: +m[4],
        minute: +m[5],
        second: +m[6],
        utc: !!m[7],
        tzid: params.TZID || null,
    };
}

function partsInTz(date, tz) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(date);
    const get = t => parts.find(p => p.type === t).value;
    let h = parseInt(get('hour'), 10);
    if (h === 24) h = 0;
    return {
        year: parseInt(get('year'), 10),
        month: parseInt(get('month'), 10),
        day: parseInt(get('day'), 10),
        hour: h,
        minute: parseInt(get('minute'), 10),
    };
}

function formatTime12(hour, minute) {
    const period = hour >= 12 ? 'pm' : 'am';
    const h12 = ((hour + 11) % 12) + 1;
    return `${h12}:${pad2(minute)} ${period}`;
}

function formatDateTime(dt, targetTz) {
    if (!dt) return { date: '', time: '', timezone: targetTz };
    if (dt.kind === 'date') {
        return {
            date: `${pad4(dt.year)}-${pad2(dt.month)}-${pad2(dt.day)}`,
            time: '',
            timezone: dt.tzid || targetTz,
        };
    }
    if (dt.utc) {
        const ms = Date.UTC(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second);
        const p = partsInTz(new Date(ms), targetTz);
        return {
            date: `${pad4(p.year)}-${pad2(p.month)}-${pad2(p.day)}`,
            time: formatTime12(p.hour, p.minute),
            timezone: targetTz,
        };
    }
    return {
        date: `${pad4(dt.year)}-${pad2(dt.month)}-${pad2(dt.day)}`,
        time: formatTime12(dt.hour, dt.minute),
        timezone: dt.tzid || targetTz,
    };
}

function parseIcal(text, targetTz) {
    const unfolded = unfoldIcal(text);
    const lines = unfolded.split(/\r\n|\n|\r/);
    const events = [];
    let cur = null;
    for (const line of lines) {
        if (line === 'BEGIN:VEVENT') {
            cur = { _raw: {} };
        } else if (line === 'END:VEVENT') {
            if (cur) {
                const raw = cur._raw;
                const dtStart = raw.DTSTART ? parseDtValue(raw.DTSTART.value, raw.DTSTART.params) : null;
                const dtEnd = raw.DTEND ? parseDtValue(raw.DTEND.value, raw.DTEND.params) : null;
                const start = formatDateTime(dtStart, targetTz);
                const end = formatDateTime(dtEnd, targetTz);
                events.push({
                    uid: raw.UID || '',
                    title: raw.SUMMARY || '',
                    url: raw.URL || '',
                    location: raw.LOCATION || '',
                    description: raw.DESCRIPTION || '',
                    date: start.date,
                    timeStart: start.time,
                    timeEnd: end.time,
                    dateEnd: end.date && end.date !== start.date ? end.date : '',
                    timezone: start.timezone,
                    raw,
                });
            }
            cur = null;
        } else if (cur) {
            const idx = line.indexOf(':');
            if (idx === -1) continue;
            const keyPart = line.slice(0, idx);
            const value = line.slice(idx + 1);
            const [name, ...paramParts] = keyPart.split(';');
            const params = {};
            for (const p of paramParts) {
                const eq = p.indexOf('=');
                if (eq !== -1) params[p.slice(0, eq)] = p.slice(eq + 1);
            }
            const decoded = unescapeIcalText(value);
            const upper = name.toUpperCase();
            if (upper === 'DTSTART' || upper === 'DTEND' || upper === 'DTSTAMP' || upper === 'LAST-MODIFIED' || upper === 'CREATED') {
                cur._raw[upper] = { value: decoded, params };
            } else {
                cur._raw[upper] = decoded;
            }
        }
    }
    return events;
}

async function fetchText(url) {
    const res = await fetch(url, {
        headers: { 'User-Agent': 'cna-website-fetchMeetups/1.0' },
        redirect: 'follow',
    });
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText} for ${url}`);
    }
    return res.text();
}

async function fetchGroup(group, targetTz) {
    const slug = group.meetupGroup;
    const rssUrl = `https://www.meetup.com/${slug}/events/rss`;
    console.log(`[${slug}] fetching RSS ${rssUrl}`);
    const rssXml = await fetchText(rssUrl);
    const eventUrls = extractEventLinks(rssXml);
    console.log(`[${slug}] ${eventUrls.length} event link(s)`);

    const events = [];
    for (const eventUrl of eventUrls) {
        const icalUrl = icalUrlFor(eventUrl);
        try {
            console.log(`[${slug}] fetching iCal ${icalUrl}`);
            const ical = await fetchText(icalUrl);
            let parsed = [];
            try {
                parsed = parseIcal(ical, targetTz);
            } catch (e) {
                console.warn(`[${slug}] iCal parse warning for ${icalUrl}: ${e.message}`);
            }
            const primary = parsed[0] || {};
            events.push({
                url: primary.url || eventUrl,
                icalUrl,
                uid: primary.uid || '',
                title: primary.title || '',
                date: primary.date || '',
                dateEnd: primary.dateEnd || '',
                timeStart: primary.timeStart || '',
                timeEnd: primary.timeEnd || '',
                timezone: primary.timezone || targetTz,
                location: primary.location || '',
                description: primary.description || '',
                ical,
                parsed,
            });
        } catch (e) {
            console.warn(`[${slug}] failed ${icalUrl}: ${e.message}`);
            events.push({ url: eventUrl, icalUrl, error: e.message });
        }
    }

    return {
        meetupGroup: slug,
        chapter: group.chapter,
        rssUrl,
        events,
    };
}

async function main() {
    let args;
    try {
        args = parseArgs(process.argv.slice(2));
    } catch (e) {
        console.error(e.message);
        console.error(USAGE);
        process.exit(2);
    }

    if (args.help) {
        console.log(USAGE);
        return;
    }
    if (!args.config || !args.output) {
        console.error('--config and --output are required');
        console.error(USAGE);
        process.exit(2);
    }

    const targetTz = args.timezone || DEFAULT_TIMEZONE;
    const configPath = path.resolve(args.config);
    const outputPath = path.resolve(args.output);

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!Array.isArray(config.groups)) {
        throw new Error(`config.groups must be an array (in ${configPath})`);
    }

    const results = [];
    for (const group of config.groups) {
        if (!group.meetupGroup || !group.chapter) {
            console.warn(`skipping invalid entry: ${JSON.stringify(group)}`);
            continue;
        }
        try {
            results.push(await fetchGroup(group, targetTz));
        } catch (e) {
            console.error(`[${group.meetupGroup}] failed: ${e.message}`);
            results.push({
                meetupGroup: group.meetupGroup,
                chapter: group.chapter,
                error: e.message,
            });
        }
    }

    const output = {
        fetchedAt: new Date().toISOString(),
        timezone: targetTz,
        groups: results,
    };

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

    const totalEvents = results.reduce((n, g) => n + (g.events ? g.events.length : 0), 0);
    console.log(`Wrote ${totalEvents} event(s) across ${results.length} group(s) to ${outputPath}`);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});

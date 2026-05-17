---
name: sync-meetups
description: Sync upcoming chapter meetups for the cna-website repo. Runs cna/scripts/fetchMeetups.js against meetup.com to download per-chapter event data, diffs against existing MDX files under cna/src/pages/<chapter>/, and creates missing meetup MDX files. Use when the user says "sync meetups", "/sync-meetups", "check for new meetups", "update meetup events", or asks to refresh chapter event listings in the cna-website repo.
---

# sync-meetups

Reconcile chapter meetup events between meetup.com and the local repo (`cna-website`). Fill the gaps in the repo. Report the state.

Data source is **only** `cna/scripts/fetchMeetups.js`. Do not WebFetch meetup pages directly. Do not query `community.cncf.io`.

## Inputs

- Config JSON listing `{ meetupGroup, chapter }` pairs (see schema below).
- Output JSON path the script will write to.

Default paths used by this skill (override if user specifies otherwise):

- Config: `cna/scripts/meetups.config.json`
- Output: `cna/data/meetups.json`

Config schema:

```json
{
  "groups": [
    { "meetupGroup": "cncf-graz",                     "chapter": "graz"   },
    { "meetupGroup": "cloud-native-linz",             "chapter": "linz"   },
    { "meetupGroup": "cloud-native-computing-vienna", "chapter": "vienna" },
    { "meetupGroup": "cloud-native-austria",          "chapter": "austria"}
  ]
}
```

Every `chapter` value must match an existing folder under `cna/src/pages/<chapter>/`. If it does not, stop and ask — this skill does not bootstrap new chapters (see `CONTRIBUTING.md`).

## Workflow

### 1. Locate the repo

Confirm CWD is the `cna-website` repo (look for `cna/docusaurus.config.js`). If not, ask the user where the repo is. All paths below are repo-relative.

### 2. Ensure config exists

If the config file does not exist at the default path (or the user's chosen path), ask the user which meetup.com groups map to which chapter folders, then write the config JSON to the chosen path.

### 3. Read existing events

For each chapter slug in the config, list `cna/src/pages/<chapter>/*.mdx` and parse filenames matching `^\d{8}\.mdx$`. The 8-digit prefix is the date in `YYYYMMDD`. Keep a per-chapter set of `repoDates` and read each existing file's front-matter `urlMeetup` to detect already-tracked event URLs.

### 4. Run the fetcher

From the `cna/` directory:

```bash
node scripts/fetchMeetups.js --config scripts/meetups.config.json --output data/meetups.json
```

Optional flags:
- `--timezone <IANA tz>` — default `Europe/Vienna`. All `date` / `timeStart` / `timeEnd` fields in the output are formatted in this zone.

The script:
- fetches `https://www.meetup.com/<meetupGroup>/events/rss` per group,
- extracts each event link from RSS,
- downloads `<eventLink>/ical` for each event,
- writes a JSON file with structured per-event fields.

### 5. Read the script output

The output JSON has shape:

```json
{
  "fetchedAt": "ISO timestamp",
  "timezone": "Europe/Vienna",
  "groups": [
    {
      "meetupGroup": "...",
      "chapter": "...",
      "rssUrl": "...",
      "events": [
        {
          "url": "https://www.meetup.com/<group>/events/<id>/",
          "icalUrl": "...",
          "uid": "...",
          "title": "...",
          "date": "YYYY-MM-DD",
          "dateEnd": "YYYY-MM-DD (empty if same day)",
          "timeStart": "H:MM am/pm",
          "timeEnd": "H:MM am/pm",
          "timezone": "Europe/Vienna",
          "location": "raw LOCATION (often 'Venue, Address')",
          "description": "DESCRIPTION (unescaped)",
          "ical": "raw VCALENDAR text",
          "parsed": [ { /* full VEVENT */ } ]
        }
      ]
    }
  ]
}
```

If a group entry has `error` instead of `events`, the RSS fetch failed — surface it in the report and continue.

### 6. Diff

Per chapter, key events by `date` (`YYYY-MM-DD`). An event is **missing in repo** when `cna/src/pages/<chapter>/<YYYYMMDD>.mdx` does not exist (derive `YYYYMMDD` by stripping dashes from `date`).

Skip events where `date` is empty or in the past (`date < today`).

### 7. Create missing files

For each missing event, write `cna/src/pages/<chapter>/<YYYYMMDD>.mdx` using this exact template. Map script fields → front matter directly; do not invent values.

```mdx
---
id: <YYYYMMDD>
title: <event.title>
date: "<event.date>"
timeStart: "<event.timeStart>"
timeEnd: "<event.timeEnd>"
location: "<venue name — first segment of event.location, before the first comma; empty if none>"
locationAddress: "<rest of event.location after the first comma, trimmed; empty if none>"
locationGmapsUrl: ""
locationOpenStreetUrl: ""
urlMeetup: "<event.url>"
---

import MeetingInfo from "@site/src/components/MeetingInfo";

<MeetingInfo frontMatter={frontMatter} />

## Topics

<event.description trimmed; if empty or whitespace, write "TBD">
```

Rules:

- `id` value: 8-digit date with no quotes (matches existing convention).
- `date`: ISO `YYYY-MM-DD`, quoted.
- `timeStart` / `timeEnd`: copy verbatim from the script (`H:MM am/pm`, e.g. `5:00 pm`, `6:30 pm`).
- `location` / `locationAddress`: split `event.location` on the first `,`. If `event.location` is empty, leave both empty.
- Never fabricate Google Maps or OpenStreetMap URLs — leave them empty for the user to fill.
- Do not include `urlBevy` — that field is retired from the new workflow.

### 8. Refresh derived data

From `cna/`:

```bash
npm run prepare
```

This regenerates `cna/data/mdxFrontMatter.json`. If it errors, surface the error and point to the offending file.

### 9. Report

End the response with one markdown table covering every upcoming event found across chapters:

| Chapter | Date | Title | meetup.com | repo |
|---------|------|-------|------------|------|

Cell values:
- meetup.com: `✓` (link the URL).
- repo: `✓ existing`, `+ created` (this run), `—`.

Below the table:
- per-group fetch errors (if any),
- files created (paths),
- files that need the user to add `locationGmapsUrl` / `locationOpenStreetUrl`,
- whether `npm run prepare` succeeded,
- explicit reminder: review every created file and add the map URLs.

## Boundaries

- Do not modify existing MDX files unless the user explicitly asks.
- Do not delete any files, even if a meetup was cancelled on meetup.com.
- Do not commit or push.
- Past events (`date < today`) are out of scope — neither create nor report.
- If a chapter slug in the config has no folder under `cna/src/pages/`, stop and ask: this skill does not bootstrap new chapters.
- Do not call `community.cncf.io` or WebFetch meetup pages directly. The script is the only data source.

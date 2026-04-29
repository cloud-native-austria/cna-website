---
name: sync-meetups
description: Sync upcoming chapter meetups for the cna-website repo. Fetches events from meetup.com group pages and community.cncf.io (Bevy) chapter pages, diffs against existing MDX files under cna/src/pages/<chapter>/, creates missing meetup MDX files, and prints a tabular cross-platform overview. Use when the user says "sync meetups", "/sync-meetups", "check for new meetups", "update meetup events", or asks to refresh chapter event listings in the cna-website repo.
---

# sync-meetups

Reconcile chapter meetup events across three platforms: meetup.com, community.cncf.io (Bevy), and the local repo (`cna-website`). Fill the gaps in the repo. Report the state.

## Inputs (ask the user if not provided)

For each chapter the user wants synced, you need:

- Chapter slug — must match an existing folder under `cna/src/pages/<chapter>/` (e.g. `graz`, `vienna`, `linz`, `innsbruck`).
- meetup.com URL — group events page, e.g. `https://www.meetup.com/cncf-graz/events/`.
- community.cncf.io URL — chapter Bevy page, e.g. `https://community.cncf.io/cloud-native-graz/`.

Either platform URL may be empty (`""`/`null`) — chapter exists on only one. Skip that platform for that chapter.

Use the table below for information you need to lookup chapter events.

| Chapter   | meetup.com                                                   | community.cncf.io                                 | repo                    |
|-----------|--------------------------------------------------------------|---------------------------------------------------|-------------------------|
| graz      | https://www.meetup.com/cncf-graz/events/                     | https://community.cncf.io/cloud-native-graz/      | cna/src/pages/graz      |
| innsbruck |                                                              | https://community.cncf.io/cloud-native-innsbruck/ | cna/src/pages/innsbruck |
| linz      | https://www.meetup.com/cloud-native-linz/events/             | https://community.cncf.io/cloud-native-linz/      | cna/src/pages/linz      |
| vienna    | https://www.meetup.com/cloud-native-computing-vienna/events/ | https://community.cncf.io/cloud-native-vienna/    | cna/src/pages/vienna    |
| carinthia |                                                              | https://community.cncf.io/cloud-native-carinthia/ | cna/src/pages/carinthia |
| austria   | https://www.meetup.com/cloud-native-austria/events/          | https://community.cncf.io/cloud-native-austria/   | cna/src/pages/austria   |

## Workflow

### 1. Locate the repo

Confirm CWD is the `cna-website` repo (look for `cna/docusaurus.config.js`).
If not, ask the user where the repo is.
All file paths below are repo-relative.

### 2. Read existing events

For each chapter slug, list `cna/src/pages/<chapter>/*.mdx` and parse filenames matching `^\d{8}\.mdx$`.
The 8-digit prefix is the date in `YYYYMMDD`.
Read each file's front matter for `title`, `urlMeetup`, `urlBevy` — used later to enrich the report and to detect events that already exist but are missing one of the URLs.

Keep a per-chapter set of `repoDates`.

### 3. Fetch from meetup.com (use the iCal feed, NOT the HTML page)

The meetup.com group page (`/events/`) is a client-rendered SPA.
WebFetch sees only the SSR shell and reports `Upcoming: 0` even when events exist. Do not use it.

Use the iCal feed instead: append `ical/` to the meetup URL → `https://www.meetup.com/<group>/events/ical/`.
It returns a static `.ics` file with structured event data for every upcoming event.

Fetch with WebFetch using this prompt:

> Return the raw iCal content. For every VEVENT block extract: SUMMARY, DTSTART (with TZID), DTEND (with TZID), LOCATION, DESCRIPTION, URL. Return as a JSON array.

Conversion rules per VEVENT:
- `DTSTART` is `YYYYMMDDTHHMMSS` plus `TZID=<zone>` (typically `Europe/Vienna`). Date → `YYYY-MM-DD`. Time → repo style (lowercase `am`/`pm`, no leading zero; e.g. `17:00` → `5pm`, `18:30` → `6:30pm`).
- `DTEND` → `timeEnd`, same conversion.
- `SUMMARY` → `title`. Keep verbatim (meetup.com often uses ` - ` instead of `,`).
- `LOCATION` → split on first `,` into `location` (venue name) and `locationAddress` (rest). If empty, leave both empty.
- `DESCRIPTION` → Topics body. Strip the leading `Cloud Native Community Group <Chapter>\n` prefix meetup.com prepends. If body is `tba`/empty/whitespace, write `TBD`.
- `URL` → `urlMeetup`.

If the iCal feed contains zero `VEVENT` blocks the chapter genuinely has no upcoming events — record `—`.
Do not fall back to the HTML page.

If the iCal endpoint 404s (private/deleted group), report the failure for that chapter and continue.

### 4. Fetch from community.cncf.io (Bevy)

Use WebFetch on the Bevy URL with this prompt template:

> Extract every UPCOMING event from this CNCF community Bevy page. For each return: title, date in YYYY-MM-DD, start time, end time (if given), venue name, venue address, event URL and agenda/content/topics. Return as a JSON array. Skip past events.

### 5. Diff

For each chapter, build a unified set of events keyed by `YYYY-MM-DD` (with title fallback if two events share a date — rare).
For each event:

- `meetup`: present on meetup.com? store URL.
- `bevy`: present on community.cncf.io? store URL.
- `repo`: filename `YYYYMMDD.mdx` exists?

An event is **missing in repo** when at least one of `meetup`/`bevy` has it and `repo` does not.

An event is **partial in repo** when the file exists but front matter `urlMeetup` or `urlBevy` is empty while the platform has it.
Offer to enrich (do not silently rewrite — ask first per chapter).

### 6. Create missing files

For each missing event, write `cna/src/pages/<chapter>/YYYYMMDD.mdx` using this exact template (replace/evaluate `[...]` placeholders, keep empty strings where data is unknown — the user can fill later):

```mdx
---
id: <YYYYMMDD>
title: <event title>
date: "<YYYY-MM-DD>"
timeStart: "<e.g. 6pm>"
timeEnd: "<e.g. 10pm or empty string>"
location: "[add the venue name here]"
locationAddress: "[add the full venue address here]"
locationGmapsUrl: ""
locationOpenStreetUrl: ""
urlMeetup: "[meetup.com event URL or empty]"
urlBevy: "[community.cncf.io event URL or empty]"
---

import MeetingInfo from "@site/src/components/MeetingInfo";

<MeetingInfo frontMatter={frontMatter} />

## Topics

[add all agenda, description, topics etc you find on the event pages here]
```

Rules:

- `id` value: same 8-digit date with no quotes (matches existing convention).
- `date`: ISO `YYYY-MM-DD`, quoted.
- Time format: lowercase `am`/`pm`, no leading zero (e.g. `6pm`, `5:30pm`). Match existing repo style.
- Never fabricate Google Maps or OpenStreetMap URLs — leave them empty for the user to fill.
- If both platforms have the event but with slightly different titles, prefer the meetup.com title (more likely to be the canonical one); note the divergence in the final report.

### 7. Refresh derived data

After creating files, run from the `cna/` directory:

```bash
npm run prepare
```

This regenerates `cna/data/mdxFrontMatter.json`.
If it errors (e.g. invalid date), surface the error and point to the offending file.

### 8. Report

End the response with one markdown table covering every event found across all chapters and platforms. Columns:

| Chapter | Date | Title | meetup.com | community.cncf.io | repo |
|---------|------|-------|------------|-------------------|------|

Cell values:

- meetup.com / community.cncf.io: `✓` (URL present, link the URL), `—` (not on platform), `?` (fetch failed).
- repo: `✓ existing`, `+ created` (this run), `partial` (file exists but missing a URL the platforms have), `—`.

Below the table list, briefly:

- per-chapter fetch errors (if any),
- files created (paths),
- files that need the user to add `locationGmapsUrl` / `locationOpenStreetUrl`,
- whether `npm run prepare` succeeded.
- inform the user that they need to review and provide the location URLs!

## Boundaries

- Do not modify existing MDX files except when the user explicitly approves enrichment of empty `urlMeetup`/`urlBevy`.
- Do not delete any files, even if a meetup was cancelled on the platforms.
- Do not commit or push.
- Past events (date < today) are out of scope — neither fetch nor create.
- If the user names a chapter slug that has no folder under `cna/src/pages/`, stop and ask: this skill does not bootstrap new chapters (see `CONTRIBUTING.md`).

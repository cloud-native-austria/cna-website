# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

- Root holds dev-env config (`devenv.nix`, `devenv.yaml`, `.envrc`). Pre-commit hooks live in `devenv.nix` under `git-hooks.hooks` (devenv's git-hooks.nix integration — no separate `.pre-commit-config.yaml`).
- The Docusaurus site lives in `cna/`. **All `npm` commands run from `cna/`**, not the repo root.

## Dev environment

- direnv + devenv. Entering the dir auto-loads node, npm, and pre-commit (see `devenv.nix`).
- First-time setup is manual: `cd cna && npm ci`. The shell no longer runs it for you.

## Commands (from `cna/`)

| Task                                  | Command           |
|---------------------------------------|-------------------|
| Install deps                          | `npm ci`          |
| Dev server                            | `npm run start`   |
| Production build                      | `npm run build`   |
| Serve built site                      | `npm run serve`   |
| Clear Docusaurus cache                | `npm run clear`   |
| Regenerate `data/mdxFrontMatter.json` | `npm run prepare` |
| Deploy to GitHub Pages                | `npm run deploy`  |

No test suite. No linter beyond pre-commit hooks (whitespace, JSON/YAML/TOML format, large file check, private key detection — defined in `devenv.nix` under `git-hooks.hooks`). Hooks auto-install on `direnv allow`; run manually with `pre-commit run --all-files`.

`onBrokenLinks` and `onBrokenMarkdownLinks` are set to `throw`, so broken links fail the build.

## Architecture

### Chapter pages — convention-driven

Each Austrian community lives at `cna/src/pages/<chapter>/` (e.g. `graz`, `vienna`, `linz`, `innsbruck`). A chapter folder contains:

- `index.js` — page entry (copy from a sibling chapter as template).
- `description.mdx` — first line `# <Chapter Name>` is parsed as the display name.
- `YYYYMMDD.mdx` — one file per meetup. Filename is the date. Front matter (`date`, `title`, `timeStart`, `timeEnd`, `location`, `urlMeetup`, etc.) drives rendering. Schema example in `CONTRIBUTING.md`.
- Logo: `cna/static/img/<chapter>.svg` (or `.png`).

### The location-overview plugin

A custom Docusaurus plugin defined inline in `cna/docusaurus.config.js` (`locationOverviewPlugin`) walks `src/pages/`, picks up `description.mdx` and `YYYYMMDD.mdx` files per folder, and exposes the result as Docusaurus global data (`locations`). The homepage components consume this. Adding a new chapter requires no plugin change — drop the folder in.

### MDX preprocessing

`scripts/preprocessMdx.js` (run via `npm run prepare`) recursively scans `src/pages/`, validates each MDX file's front-matter date, **filters out past meetups**, and writes upcoming ones to `data/mdxFrontMatter.json`.
Components import that JSON to render upcoming-meetup cards. Re-run `npm run prepare` after editing meetup MDX or after a meetup date passes.

### i18n

Locales: `en` (default), `de`. Translations under `cna/i18n/`. Locale switcher is currently commented out in the navbar.

### Components

Reusable React components under `cna/src/components/` (`Banner`, `Carousel`, `Facts`, `IntroText`, `Locations`, `Map`, `MapInteractive`, `Meeting`, `MeetingInfo`, `Sponsors`). Theme overrides under `cna/src/theme/`. Global CSS under `cna/src/css/custom.css`.

## Brand (from README)

| Color          | Hex       |
|----------------|-----------|
| Primary Blue   | `#0073CF` |
| Secondary Blue | `#005AA7` |
| Orange         | `#FF9900` |
| White          | `#FFFFFF` |

Font: Roboto. Headings = Bold/Semi-Bold, body = Regular/Light.

## Adding a new meetup (quick path)

1. Create `cna/src/pages/<chapter>/YYYYMMDD.mdx` with required front matter (see `CONTRIBUTING.md`).
2. `npm run prepare` to refresh `data/mdxFrontMatter.json`.
3. `npm run start` to verify.

## Adding a new chapter

1. `cna/src/pages/<chapter>/index.js` (copy from existing chapter).
2. `cna/src/pages/<chapter>/description.mdx` — first line is `# <Display Name>`.
3. Logo at `cna/static/img/<chapter>.svg`.
4. Add navbar entry under the `Communities` dropdown in `cna/docusaurus.config.js`.

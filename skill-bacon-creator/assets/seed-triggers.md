# Bacon Seed Triggers (v1.1)

Run Bacon **before** drafting. Not after.
These examples show the right invocation moment, the right input shape, and what to expect back.

---

## The Golden Rule

```
Idea forms → run bacon → observe → experiment → rules → SKILL.md
                    ↑
              fire here, not after you've already written the skill
```

If you run Bacon on a skill you already wrote, you're debugging — not preventing.
The ROI is highest when it fires first.

---

## Seed Invocations

### Seed 1 — External API (authenticated)
```
bacon fetch jazz playlists from Spotify
```
**When:** You have the idea "I want a skill that pulls Spotify playlists" — before opening SKILL.md.
**Observation Lab will probe:** `/search`, `/me`, auth headers, 401 handling.
**Likely idol:** Tribe — "Spotify API is stable and well-documented."

---

### Seed 2 — Calendar + vault integration
```
bacon auto-generate Obsidian daily notes from Google Calendar events
```
**When:** You want calendar + note-taking wired together — before writing any prompts.
**Observation Lab will probe:** Calendar API shape, Obsidian vault write path, empty-day edge case.
**Likely idol:** Cave — "I did something similar with Notion so this will work."

---

### Seed 3 — Web fetch + extraction
```
bacon extract key quotes from web articles and save to Obsidian
```
**When:** Use case involves fetch_url + structured output + file write — before drafting.
**Observation Lab will probe:** fetch_url response shape, HTML vs JSON, rate limits.
**Likely idol:** Marketplace — "extract" used loosely without defining output format.

---

### Seed 4 — CLI tool wrapper
```
bacon run ffmpeg audio normalisation on a folder of files
```
**When:** You want to wrap an exec-based tool — before assuming the CLI flags work as documented.
**Observation Lab will probe:** exec + which ffmpeg, version check, flag behaviour on sample file.
**Likely idol:** Theatre — "ffmpeg docs say this flag works" — confirmed only by docs, not by exec.

---

### Seed 5 — Internal data source
```
bacon read and summarise unread messages from a Slack channel
```
**When:** Skill targets an internal tool with a REST API — before assuming auth scope is sufficient.
**Observation Lab will probe:** Slack API token scope, channel read endpoint, pagination shape.
**Likely idol:** Tribe — "our Slack token has full read access" — assumed, not verified.

---

### Seed 6 — Browser automation
```
bacon scrape product prices from an e-commerce site and write to CSV
```
**When:** Skill needs browser or fetch_url for structured data extraction — before drafting selectors.
**Observation Lab will probe:** fetch_url response, HTML structure stability, bot detection (403/429).
**Likely idol:** Cave — "scraping worked on a similar site last time."

---

### Seed 7 — File pipeline
```
bacon watch a folder for new PDFs and extract text into markdown files
```
**When:** Skill involves exec + file system watch + output write — before assuming tool availability.
**Observation Lab will probe:** exec + which pdftotext (or alternative), file watcher behaviour, encoding edge cases.
**Likely idol:** Marketplace — "extract text" undefined: native text layer vs OCR vs structured tables.

---

## What a Valid Invocation Looks Like

```
Input:  bacon fetch jazz playlists from Spotify

Phase 1: Input valid — target: "fetch jazz playlists from Spotify"
         Folder created: skill-fetch-jazz-playlists-from-spotify-creator/
         state.json written (phase: 1)

Phase 2: Observation Lab
         [search_web] "Spotify API playlist search endpoint" → result recorded
         [fetch_url]  GET https://api.spotify.com/v1/search?q=jazz → 401 (no token)
         Idol flagged: Tribe — "API is public" — PATCHED: /search requires OAuth
         Gate passed: 2 observations, 1 edge case recorded
         → references/data/observations.md written

Phase 3: Experiment Run
         Variant 1: fetch with Bearer token → 200, JSON shape recorded
         Variant 2: fetch without token → 401 confirmed
         Gate passed: 2 variants logged
         → references/data/experiments.md written

Phase 4: Induction
         Rule 1: If no token, return 401 → fallback to search_web scrape
         Rule 2: If search_web returns empty, validate with exec + curl
         Rule 3: If rate limit (429), back off 2s, retry once
         Gate passed: 3 rules, all traceable
         → references/rules.md written

Phase 5: Idols Checkpoint
         Tribe flag patched (see observations)
         → references/idols-log.md written

Phase 6: Skill Foundry — pre-flight passed
         All files written to skill-fetch-jazz-playlists-from-spotify-creator/

Phase 7: Conclusion Gate — all 5 gates passed
         ✓ Done: skill-fetch-jazz-playlists-from-spotify-creator/
```

---

## What a Rejected Invocation Looks Like

```
Input:  bacon jazz

Response:
  I need a concrete target to work with — not a vague category.
  Try something like: 'fetch jazz playlists from Spotify'
  or 'auto-generate Obsidian daily notes from calendar.'
  What are you building?

  (2nd rejection → stop)
```

```
Input:  bacon something about AI

Response:
  I need a concrete target to work with — not a vague category.
  Try something like: 'fetch AI model benchmark results from HuggingFace'
  or 'summarise arxiv AI papers published today.'
  What are you building?
```

---

## Resuming an Interrupted Session

If a session is interrupted mid-phase, re-invoke with the same niche:

```
bacon fetch jazz playlists from Spotify
```

Bacon reads `state.json`, finds `phase: 3`, and resumes from Experiment Run.
It does not restart from Phase 1. Prior observations are preserved.

---

## Re-running on an Existing Skill (Version Bump)

If you re-run Bacon on a niche that already has a built skill:

```
bacon fetch jazz playlists from Spotify
```

Bacon detects the existing folder, reads `state.json`, and treats this as a version update:
- New observations are appended (not overwritten)
- Version is bumped in `state.json` and output `SKILL.md`
- A `## Changelog` entry is added to the output `SKILL.md`

This is the correct way to update a Bacon-built skill after the target API changes.

---

## Anti-Patterns

| What you typed | Why it's wrong | What to do instead |
|---|---|---|
| `bacon jazz` | Too short and vague — rejected | `bacon fetch jazz playlists from Spotify` |
| `bacon something about AI` | Vague category — rejected | `bacon summarise arxiv AI papers published today` |
| `bacon my broken skill` | Debugging, not prevention — wrong phase | Fix the skill directly; Bacon is for new builds |
| `bacon playlist fetcher` _(after writing SKILL.md)_ | Running after drafting — lowest ROI | Run Bacon first, then write from its output rules |
| `bacon manage stuff` | Vague verb + vague noun — rejected | Specify the tool, the data source, and the action |

---

*Generated by skill-bacon-creator v1.1 — Bacon's Empiricist Skill Builder*

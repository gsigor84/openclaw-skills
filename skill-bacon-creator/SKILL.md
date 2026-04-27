---
id: skill-bacon-creator
version: "1.1"
name: skill-bacon-creator
description: "Bacon's Empiricist Skill Builder. Applies Francis Bacon's scientific method to skill creation: Observe (real tool calls), Experiment (test variants), Induct (derive rules), Idols Check (purge bias), Conclude (build only from evidence). Use this skill whenever the user wants to build a new OpenClaw skill from scratch, especially when the target involves external APIs, data sources, or tool integrations that must be verified before trust. Trigger on: 'bacon [niche]', 'build with bacon', 'skill-bacon-creator'. Do not trigger for skill edits or improvements — only for new skill creation from zero. Output: full skill-{name}-creator/ folder scaffold with references/, scripts/, assets/."
tools:
  - read
  - write
  - exec
  - search_web
  - fetch_url
  - browser
runtime:
  group: runtime
---

# skill-bacon-creator (v1.1)

An empiricist skill builder grounded in Francis Bacon's scientific method. Before any skill is written, it is observed, tested, and verified — not speculated into existence.

---

## Trigger
- `bacon [skill-niche]`
- `build with bacon [skill-niche]`
- `skill-bacon-creator [skill-niche]`

---

## Guiding Principles

1. **No speculation without evidence.** If the skill's behaviour hasn't been observed in the environment, it hasn't been written — it has been guessed.
2. **No tool call is hypothetical.** Every fetch, exec, or search in the Observe phase fires live. If it fails, the failure is real data.
3. **Idols are named before they are dismissed.** Every assumption is labelled: Tribe, Cave, Marketplace, or Theatre.
4. **The conclusion is the last thing, never the first.**
5. **Five tool calls maximum per session.** Cost and rate discipline over exhaustive testing.
6. **State is written, not assumed.** After each phase completes, write a `state.json` to the output folder. If a session is interrupted, resume from the last recorded phase — never restart from scratch.
7. **Rules must be traceable or they are deleted.** Any rule in `references/rules.md` without a direct pointer to a recorded observation is removed before the Skill Foundry begins.

---

## Core Loop

```
SKILL ENTRY
  ↓
OBSERVATION LAB       → references/data/observations.md
  ↓
EXPERIMENT RUN        → references/data/experiments.md
  ↓
INDUCTION STAGE       → references/rules.md
  ↓
IDOLS CHECKPOINT      → references/idols-log.md
  ↓
SKILL FOUNDRY         → SKILL.md + scripts/ + assets/
  ↓
CONCLUSION GATE       → traceability check (rules → observations)
  ↓
OUTPUT: skill-{name}-creator/
```

---

## Phase 1 — Skill Entry

**Input:** A concrete skill niche or topic from the user (e.g., "playlist fetcher", "Obsidian daily note")

**Vague input rejection:**
> "I need a concrete target to work with — not a vague category. Try something like: 'fetch jazz playlists from Spotify' or 'auto-generate Obsidian daily notes from calendar.' What are you building?"

If input is rejected twice: output the rejection message and stop.

**On valid input:**
1. Declare the target skill name
2. Build the output folder scaffold immediately (all dirs, empty placeholder files)
3. Write initial `state.json`:
```json
{
  "skill": "<niche>",
  "version": "1.1",
  "phase": 1,
  "phases_complete": [],
  "tool_calls": {},
  "started_at": "<ISO timestamp>"
}
```
4. Begin Observation Lab

**Resume rule:** If `state.json` already exists in the target folder, read it and resume from `phase` field. Do not overwrite prior observations.

---

## Phase 2 — Observation Lab

**Goal:** Observe the real environment before writing anything about the target.

**Tool cap:** 3× `search_web`, 1× `exec`, 1× `fetch_url` (maximum per session).

**What to observe:**
- Target APIs or data sources — real endpoints, real response shapes
- Edge case probes: empty input, rate limits (HTTP 429), auth walls
- JSON structure validation — does the data look like what the skill expects?
- Existing skill patterns in the workspace (look for similar SKILL.md files)

**For each observation:**
1. Fire the tool call
2. Record the raw output in `references/data/observations.md` using this format:
```
## Observation [N] — <tool> — <ISO timestamp>
**Query:** <exact query or command>
**Result:** <raw output, truncated at 500 chars if needed>
**Idols flagged:** <Tribe / Cave / Marketplace / Theatre — or "none">
**Signal:** <what this tells us>
```
3. Update `state.json` → increment `tool_calls[tool]`

**Early Idols Check:** As results come in, flag:
- Tribe bias: "The API is public and stable" — cite evidence (rate limits hit? 403 returned?)
- Cave bias: "My use case matches what I read online" — cite the specific mismatch
- Theatre bias: "Everyone's using this endpoint" — cite whether that belief is confirmed by data

**Done when:**
- ≥2 real tool calls have fired (not just 1 — a single result is not a pattern)
- At least one result covers the happy path AND one covers a failure or edge case
- Raw observations written to `references/data/observations.md`
- `state.json` updated: `"phases_complete": ["observation"]`

---

## Phase 3 — Experiment Run

**Goal:** Test 2-3 variants of the skill's behaviour in the real environment before drafting.

**What to experiment:**
- Try fetch variants (e.g., with auth header vs. without)
- Try fallback strategies (e.g., if search_web returns empty, try exec curl)
- Try edge cases: empty input, malformed URL, rate-limited response

**For each experiment:**
1. Run the variant
2. Record to `references/data/experiments.md`:
```
## Experiment [N] — <variant name> — <ISO timestamp>
**Hypothesis:** <what we expected>
**Command / call:** <exact input>
**Result:** success | error | partial
**Raw output:** <truncated at 500 chars>
**What this changes:** <rule implication>
```

**No-signal handling:** If all 2-3 variants fail or return no usable data:
- Record each failure explicitly
- Declare: "Experiment phase produced no positive signal. Induction will be limited to failure-mode rules only. Skill Foundry will flag this in the output SKILL.md."
- Do NOT skip to Foundry pretending experiments succeeded

**Done when:**
- 2-3 variants tested and logged (pass or fail — failure counts)
- `state.json` updated: `"phases_complete": [..., "experiments"]`

---

## Phase 4 — Induction Stage

**Goal:** Derive if-then rules from the observed experiment results. No rule may exist without a traceable source.

**Process:**
1. Read `references/data/observations.md` and `references/data/experiments.md`
2. For each pattern found, write one rule
3. Every rule must cite its source observation by index number

**Output:** `references/rules.md`

**Rules format:**
```
## Rule [N]
If [condition], then [result].
Source: Observation [N] / Experiment [N]
```

**Example:**
```
## Rule 1
If Spotify API returns 401, then fallback to YouTube scraping via search_web.
Source: Observation 2 (auth wall hit on /me endpoint)

## Rule 2
If search_web returns empty snippet, then validate with exec + curl before assuming no data.
Source: Experiment 1 (empty result on first query, curl returned data)

## Rule 3
If rate limit (429) hit on first attempt, then back off 2s and retry once only.
Source: Observation 3 (429 on high-frequency probe)
```

**Traceability purge:** Before writing the file, check every rule against recorded observations. Any rule with no citation is deleted — not kept as "provisional."

**Done when:**
- ≥3 if-then rules written, each with a source citation
- `state.json` updated: `"phases_complete": [..., "induction"]`

---

## Phase 5 — Idols Checkpoint

**Goal:** Surface and purge the remaining biases before writing the SKILL.md.

**The four Idols (Bacon, 1620):**

| Idol | Description | How it surfaces in skill building |
|---|---|---|
| **Tribe** | Human nature sees patterns that aren't there | "Spotify API is well-documented and stable" — repeated across blog posts, never verified |
| **Cave** | Personal bias from past experience | "I used a similar pattern before so this will work" |
| **Marketplace** | Words become treated as facts | "This API is standard" — vague label masking an uninvestigated endpoint |
| **Theatre** | Blind belief in authority or systems | "Basecamp uses this so it's correct" — argument from authority with no data |

**Procedure:**
1. Read all entries in `references/data/observations.md` and `references/data/experiments.md`
2. For each Idol type, ask: "Did this bias appear at any point?"
3. Flag the 1-2 highest-impact cases only (clarity over exhaustiveness)
4. For each flag: either patch it (state the corrected assumption) or declare it unresolved ("needs resolution before build")
5. If no idols are found, write explicitly: "No idols detected in this session."

**Output:** `references/idols-log.md`

```
| Idol | Flag | Status | Patch or Action |
|---|---|---|---|
| Tribe | "API is public" assumed without auth test | Patched | Confirmed: /search public, /me requires OAuth |
| Theatre | "Basecamp approach is correct" cited with no evidence | Unresolved | Removed assumption — needs verification |
```

**Done when:**
- ≥1 idol flagged with patch, OR explicit "no idols detected" written
- `state.json` updated: `"phases_complete": [..., "idols"]`

---

## Phase 6 — Skill Foundry

**Goal:** Write the actual `SKILL.md` and all scaffold files from verified observations only.

**Pre-flight check before writing anything:**
- Confirm `references/rules.md` exists and has ≥3 cited rules
- Confirm `references/data/observations.md` exists and has ≥2 entries
- Confirm `references/idols-log.md` exists
- If any of these are missing: stop, declare which phase is incomplete, do not write SKILL.md

**Rules for SKILL.md:**
- Every procedure traces to a rule in `references/rules.md`
- No section invented without an experiment supporting it
- Include: Trigger, Use, Phase descriptions, Failure modes, Anti-patterns
- Include: Example dialogues showing the skill in action
- Include: "What this skill does NOT do" (No-Gos)
- If experiments produced no positive signal: add a `## Known Gaps` section listing what could not be verified

**Output folder structure:**
```
skill-{name}-creator/
├── SKILL.md
├── state.json                    ← session state for resumability
├── references/
│   ├── data/
│   │   ├── observations.md       ← raw tool outputs (Phase 2)
│   │   └── experiments.md        ← variant test logs (Phase 3)
│   ├── rules.md                  ← if-then rules with source citations (Phase 4)
│   ├── idols-log.md              ← bias audit table (Phase 5)
│   ├── taxonomy.md               ← domain term definitions (Marketplace idol defence)
│   └── traceability-matrix.md    ← maps: observation → rule → SKILL.md section
├── scripts/
│   ├── validate.ts               ← handler logic + live tool validation
│   └── deploy.sh                 ← manual OpenClaw skills dir install
└── assets/
    ├── diagram.md                ← breadboard topology (text/ASCII)
    └── test.json                 ← sample test data from observations
```

**taxonomy.md** — write this file even if brief. Define every domain-specific term used in the SKILL.md. Minimum entry:
```
## [Term]
**Means:** <precise definition in this skill's context>
**Does NOT mean:** <common misuse to avoid>
```

**traceability-matrix.md** — write a table:
```
| Observation | Rule | SKILL.md Section |
|---|---|---|
| Observation 2 (auth wall) | Rule 1 (401 fallback) | Phase 3 — Fallback Handling |
```

**validate.ts:**
- Wraps the full handler logic for the generated skill
- Includes live tool call tests using observed data from `references/data/`
- Validates that fetched responses match expected JSON shapes
- Fails fast if any tool call returns unexpected output

**Done when:**
- All files written
- `state.json` updated: `"phases_complete": [..., "foundry"]`

---

## Phase 7 — Conclusion Gate

**This is an active verification, not a passive checklist.**

**Run these checks in order. If any fail, declare failure and stop.**

1. **Observation gate:** Open `references/data/observations.md`. Count entries. If < 2, FAIL.
2. **Experiment gate:** Open `references/data/experiments.md`. Count entries. If < 2, FAIL.
3. **Rules gate:** Open `references/rules.md`. For every rule, confirm the cited source observation exists in `references/data/observations.md` or `references/data/experiments.md`. If any rule has no traceable source, FAIL.
4. **Idols gate:** Open `references/idols-log.md`. Confirm ≥1 entry or explicit "no idols detected." If file is empty, FAIL.
5. **Traceability gate:** Open `references/traceability-matrix.md`. Confirm every SKILL.md section that describes behaviour has a corresponding row. If any section is unlinked, FAIL.

**On all gates passing:** Declare done. Output the folder path and a one-line summary per phase.

**On failure:**
- State exactly which gate failed
- State what data is missing
- State what would be needed to retry that phase
- Do NOT declare the skill complete

**Version bump rule:** If this is an update to an existing skill (re-running bacon on an already-built skill), bump the version in both `state.json` and the output `SKILL.md` frontmatter. Record what changed in a `## Changelog` section at the bottom of the output `SKILL.md`.

---

## Examples

**Input:** `bacon playlist fetcher`
**Output:** `skill-playlist-fetch-creator/` with full scaffold

**Input:** `bacon jazznote`
**Output:** `skill-jazznote-creator/`

**Input:** `bacon` (no niche)
**Output:** Rejection message — vague input, ask for concrete niche

---

## Anti-Patterns (What This Skill Never Does)

- Never writes a SKILL.md without completing the Observe phase first
- Never accepts a vague input and moves on anyway
- Never runs more than 5 tool calls in a session
- Never treats silence from an API as confirmation that it works
- Never cites a blog post or tutorial as evidence without cross-checking with live data
- Never generates "example" tool responses — all outputs are real or explicitly marked as fallback
- Never confuses "documented" with "tested"
- Never writes a rule without a source citation — untraced rules are deleted
- Never declares done without running the Phase 7 traceability checks
- Never restarts a session from scratch if `state.json` exists — always resume

---

## Toolset
- `read`
- `write`
- `exec`
- `search_web`
- `fetch_url`
- `browser` (for live endpoint validation if needed)

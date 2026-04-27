# Skill-Bacon-Creator — Breadboard Topology (v1.1)

---

## Core Loop

```
┌─────────────────────────────────────────────────────────────────┐
│  INPUT: "bacon [concrete-niche]"                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1 — SKILL ENTRY                                          │
│                                                                 │
│  • Validate input (reject vague, reject < 3 chars)              │
│  • On 2nd rejection: stop                                       │
│  • Scaffold output folder: skill-{name}-creator/                │
│  • Read state.json if exists → RESUME from last phase           │
│  • Write state.json (phase: 1, phasesComplete: [])              │
│                                                                 │
│  OUTPUT: folder scaffold + state.json                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2 — OBSERVATION LAB                                      │
│                                                                 │
│  Tool cap: 3× search_web  1× exec  1× fetch_url                 │
│                                                                 │
│  What to observe:                                               │
│  • Real endpoints + response shapes                             │
│  • Happy path (working call)                                    │
│  • Edge case (429 / 401 / 403 / empty / null)  ← REQUIRED       │
│  • JSON structure validation                                    │
│  • Existing SKILL.md patterns in workspace                      │
│                                                                 │
│  Early Idols Check fires per observation:                       │
│  • Tribe: "API is stable" — cite evidence                       │
│  • Cave:  "matches my past use case" — cite mismatch            │
│  • Theatre: "everyone uses this" — cite confirmation            │
│                                                                 │
│  Gate: ≥2 calls fired, ≥1 edge case recorded                    │
│  FAIL → return error, stop                                      │
│                                                                 │
│  OUTPUT: references/data/observations.md                        │
│          state.json updated (phasesComplete: [observation])     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3 — EXPERIMENT RUN                                       │
│                                                                 │
│  2–3 variants tested live:                                      │
│  • Auth header vs. no auth                                      │
│  • Fallback strategy (search_web → exec curl)                   │
│  • Edge cases: empty input, malformed URL, rate limit           │
│                                                                 │
│  No-signal handling:                                            │
│  • All variants fail → declare no-signal explicitly             │
│  • Induction limited to failure-mode rules                      │
│  • Known Gaps section added to output SKILL.md                  │
│                                                                 │
│  Gate: ≥2 variants logged (pass or fail counts)                 │
│  FAIL → return error, stop                                      │
│                                                                 │
│  OUTPUT: references/data/experiments.md                         │
│          state.json updated (phasesComplete: [..., experiments]) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4 — INDUCTION STAGE                                      │
│                                                                 │
│  • Review all observations + experiments                        │
│  • Derive if-then rules: "If [condition] → [result]"            │
│  • Every rule must cite source by index                         │
│    (e.g. "Source: Observation 2")                               │
│                                                                 │
│  Traceability purge:                                            │
│  • Any rule with no citation → DELETED (not kept provisional)   │
│                                                                 │
│  Gate: ≥3 rules, all traceable                                  │
│  FAIL → return error, stop                                      │
│                                                                 │
│  OUTPUT: references/rules.md                                    │
│          state.json updated (phasesComplete: [..., induction])  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5 — IDOLS CHECKPOINT                                     │
│                                                                 │
│  Scan for 4 bias types:                                         │
│  • Tribe     — pattern assumed without evidence                 │
│  • Cave      — personal habit applied without verification      │
│  • Marketplace — vague word treated as fact                     │
│  • Theatre   — argument from authority, no data                 │
│                                                                 │
│  Flag 1–2 highest-impact cases only                             │
│  Each flag: Patched OR Unresolved (declared)                    │
│  If none found: write "No idols detected" explicitly            │
│                                                                 │
│  Gate: ≥1 flag with patch OR explicit none declaration          │
│  FAIL → return error, stop                                      │
│                                                                 │
│  OUTPUT: references/idols-log.md                                │
│          state.json updated (phasesComplete: [..., idols])      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 6 — SKILL FOUNDRY                                        │
│                                                                 │
│  Pre-flight check (BEFORE writing anything):                    │
│  • references/rules.md exists + ≥3 rules       → or STOP       │
│  • references/data/observations.md ≥2 entries  → or STOP       │
│  • references/idols-log.md exists              → or STOP       │
│                                                                 │
│  Write output files:                                            │
│  • SKILL.md          — from rules only, no invented sections    │
│  • handler.ts        — typed scaffold for generated skill       │
│  • references/taxonomy.md          — domain term definitions    │
│  • references/traceability-matrix.md — obs → rule → section    │
│  • references/data/environment.json — runtime snapshot          │
│  • scripts/validate.ts             — live validation checks     │
│  • scripts/deploy.sh               — deploy with dry-run/force  │
│  • assets/test.json                — from real observation data │
│                                                                 │
│  If no-signal declared: add ## Known Gaps to SKILL.md           │
│                                                                 │
│  OUTPUT: full skill-{name}-creator/ scaffold                    │
│          state.json updated (phasesComplete: [..., foundry])    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 7 — CONCLUSION GATE (active, not passive)                │
│                                                                 │
│  5 gates run in order. First failure halts and reports.         │
│                                                                 │
│  Gate 1: observations.md — ≥2 entries, ≥1 edge case            │
│  Gate 2: experiments.md  — ≥2 variants logged                  │
│  Gate 3: rules.md        — ≥3 rules, all source-cited          │
│  Gate 4: idols-log.md    — ≥1 flag OR explicit none            │
│  Gate 5: traceability-matrix.md — all sections linked          │
│                                                                 │
│  All pass → declare done, output folder path + summary          │
│  Any fail → declare which gate, what's missing, how to retry   │
│                                                                 │
│  Version bump rule:                                             │
│  Re-run on existing skill → bump version in state.json          │
│  and SKILL.md, add ## Changelog entry                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  OUTPUT: skill-{name}-creator/                                  │
│                                                                 │
│  ├── SKILL.md                                                   │
│  ├── handler.ts                                                 │
│  ├── state.json                                                 │
│  ├── references/                                                │
│  │   ├── rules.md                                               │
│  │   ├── idols-log.md                                           │
│  │   ├── taxonomy.md                                            │
│  │   ├── traceability-matrix.md                                 │
│  │   └── data/                                                  │
│  │       ├── observations.md                                    │
│  │       ├── experiments.md                                     │
│  │       └── environment.json                                   │
│  ├── scripts/                                                   │
│  │   ├── validate.ts                                            │
│  │   └── deploy.sh                                              │
│  └── assets/                                                    │
│      ├── diagram.md                                             │
│      ├── seed-triggers.md                                       │
│      └── test.json                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Resumability Flow

```
Session starts
     │
     ▼
state.json exists?
     │
  YES│                    NO
     ▼                    ▼
Read phase field      Init fresh state
Resume from there     Begin Phase 1
     │                    │
     └──────────┬──────────┘
                ▼
         Continue loop
```

---

## Failure Handling

```
Phase gate fails
     │
     ▼
Write state.json with error field
Return { ok: false, phase: N, error: "..." }
     │
     ▼
Adam reports: which phase, what's missing, how to retry
     │
     ▼
User provides missing data
     │
     ▼
Re-invoke handleBacon() — resumes from failed phase
(does not restart from Phase 1)
```

---

*Generated by skill-bacon-creator v1.1 — Bacon's Empiricist Skill Builder*

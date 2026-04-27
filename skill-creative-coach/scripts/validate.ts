---
name: creative-coach-validate
description: "Validation script for Creative Coach skill. Tests state persistence, mode transitions, and lock output contract."
tools:
  - read
  - write
  - exec
runtime: agent
---

# validate.ts — Creative Coach v1.0 Handler Logic

## Session State

**File:** `~/.openclaw/workspace/state/creative-coach-session.json`

**Load:** On every activation, read the state file.
**Save:** After every exchange, write updated state.

**Schema check:**
```
session_id         — present, string
status             — one of: active, parked, locked
mode               — one of: blank, extracting, exploring, constraint, incubating, shaping, locking
raw_material       — array, may be empty
active_tension     — string | null
energy_signals     — array, may be empty
techniques_used    — array, may be empty
explored_and_rejected — array, may be empty (unifies rejected_paths)
last_intervention  — string | null
parked_summary     — object | null
  material_gathered  — string
  active_tension     — string (matches root active_tension)
  closest_direction  — string
  carry_question     — string
lock_candidate     — string | null
locked_idea        — string | null
last_updated       — ISO timestamp
```

---

## Signal → Mode Decision Table

```
user_message contains "nothing" or "blank" or "I don't know"
  → mode = blank

user_message repeats same direction 3×
  → trigger parking → mode = incubating

user_message contains "cliché" or "too obvious" or "already exists"
  → mode = exploring (Make Familiar Strange)

user_message contains "too vague" or "can't pin it down"
  → mode = exploring (Make Strange Familiar)

user_message contains "too many" or "pulled in every direction"
  → mode = constraint (add one)

user_message rejects every option / "nothing feels right"
  → mode = constraint (remove one)

user_message contains "something's close" or "not quite right"
  → mode = exploring (Redefine the Problem)

user_message describes specifics (audience/form/mechanism/use-case)
  → mode = shaping

user_message shifts from "what should this be?" to "how do I build this?"
  → trigger shaping shift detection

session is resumed after parking
  → load parked_summary, ask "What surfaced?"

default (no clear signal)
  → mode = extracting (Raw Material Extraction)
```

---

## Intervention Selection

```
mode = blank       → Raw Material Extraction (observation probe)
                     Never: "What idea do you have?"

mode = extracting  → Make Strange Familiar (default)
                     OR Widen Span of Relevance
                     OR Serendipity Injection (anchored to raw_material)

mode = exploring   → Analogy from Nature
                     OR Cross-Domain Injection (must name specific domain + role)
                     OR Make Familiar Strange
                     OR Redefine the Problem (Jenner flip)

mode = constraint  → Add one constraint (if too many options)
                     OR Remove one constraint (if rejecting everything)
                     Constraint substance must come from user's material (Rule 11)

mode = incubating  → Depth Mind Parking output
                     Summarize + carry question + close

mode = shaping     → Reflect emerging idea
                     Apply: constraint test, flip test, one-sentence test
                     When shift detected → ask "Want to lock this?"

mode = locking     → Produce Shaped Idea Summary
                     Only user-surfaced material (Rule 15)
```

---

## Behavioural Constraints (enforced on every response)

```
ONE move per exchange (Rule 7)
  → response contains exactly one question or provocation
  → never two questions, never question + analogy stacked

Signal before technique (Rule 8)
  → skill identifies signal first, then picks technique
  → if no signal clear, ask one more question — never guess

Technique exhaustion (Rule 9)
  → if same technique used 2× consecutively without state change,
    switch to different technique for same signal

No lectures (Rule 12)
  → never explain creativity theory
  → never name frameworks ("Adair", "Groeneveld", "Depth Mind")
  → frameworks used silently through questions

No idea generation (Rule 13)
  → skill never produces the central idea
  → if skill catches itself producing an idea, reframe as question

No early evaluation (Rule 14)
  → no "that's good", "interesting", "I like that"
  → reflect back what was said without value assessment

Suspend judgement during divergence
  → "give me 10 bad versions" is valid
  → quantity before quality
```

---

## Depth Mind Parking Output

Must contain exactly:
```
## Parked Summary

What surfaced:
- [list from raw_material[]]

What was explored and rejected:
- [list from explored_and_rejected[]]

The live tension:
[one sentence from active_tension]

Closest direction:
[what felt nearest before parking]

Hold this question:
[one carry question — designed for walking/sleeping, not immediate answering]

When you return, I'll ask: "What surfaced?"
```

---

## Lock Output Contract

Must NOT invent. Must use only raw_material[], active_tension, and user messages.
Every item in the summary must be traceable to a specific user exchange. If it can't be traced, it's a bug.

**Required fields:**
```
Working Title        — named by skill from user's language
One-Sentence Idea    — in user's words, organised by skill
Raw Material Used    — list from raw_material[]
Central Tension      — from active_tension
Mechanism            — how it works, from user's description
Form                 — what shape it takes, from user's description
Why It Has Energy    — what made the user lean in
What It Is Not       — from explored_and_rejected[]
Next Handoff         — what happens after lock (deferred in v1)
```

---

## Validation Tests

### State Persistence
1. State file read/write cycle → preserves all fields including nested parked_summary{}
2. State updates after every exchange → last_updated changes, relevant arrays grow
3. State survives session close and reopen → all fields intact

### Blank Mode
4. Signal detection on "I have nothing" → mode = blank
5. Blank mode response never contains "What idea do you have?" or variant
6. Blank mode asks about irritations/frictions/observations — not intentions

### Signal Diagnosis
7. Signal detection on "this feels cliché" → mode = exploring (Make Familiar Strange)
8. Signal detection on "too vague" → mode = exploring (Make Strange Familiar)
9. Signal detection on "too many options" → mode = constraint (add one)
10. Signal detection on "nothing feels right" → mode = constraint (remove one)
11. Signal detection on "something's close but not right" → mode = exploring (Redefine)
12. Ambiguous signal (multiple signals at once) → default to extracting (Rule 6)

### Depth Mind Parking
13. Parking trigger on 3× same direction → parked_summary non-empty, status = parked
14. Parking output contains all required fields (surfaced, rejected, tension, closest, carry question)
15. Carry question is a single question, not an action item

### Resume
16. Resume after parking → loads parked_summary → first question = "What surfaced?"
17. Resume never restarts extraction or introduces new technique before asking
18. User's answer to "What surfaced?" routes back to Signal Diagnosis

### Shaping + Lock
19. Shaping signal detection (user speaks in specifics) → asks "Want to lock this?"
20. User says "no" to lock → returns to Signal Diagnosis, does not re-ask immediately
21. Lock output → every item traceable to raw_material[] or user message
22. Lock output → no invented content (diff lock output against raw_material[])
23. Lock output → all required fields present

### Technique Rules
24. One move per exchange → response contains exactly one question/provocation
25. Technique exhaustion → same technique 2× without progress → skill switches
26. Cross-domain injection names specific domain + specific role (Rule 20)
27. Serendipity injection connects to existing raw_material (Rule 21)
28. Constraint operations → only one at a time, substance from user's material (Rules 10, 11)

### Edge Cases
29. User rejects skill's move → skill drops technique, asks "What would be useful?" (Rule 19)
30. User arrives with formed idea → skips to Shaping Mode, no forced blank/extraction (Rule 18)
31. User quits without locking → state saved, no forced carry question (Rule 17)
32. No early evaluation at any point → no "that's good" / "interesting" / validation (Rule 14)

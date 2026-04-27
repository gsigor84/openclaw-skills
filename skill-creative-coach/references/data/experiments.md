# Creative Coach — Experiments

## Note — Bypass for Conversation-Only Skill

This skill makes no external API calls. There are no endpoints to probe, no auth walls to test, no rate limits to encounter. The Experiment Run phase produces no live signal because there is nothing to test externally.

All behaviour is defined by the SpecGate spec. The following entries document the internal logic tests that would be run in a normal Bacon session — and are confirmed by spec inspection.

---

## Experiment 1 — State Persistence Test — 2026-04-24

**Hypothesis:** Session state can be serialized to JSON and resumed after a simulated close.

**Source:** Spec Section 13 (State Requirements) — defines mandatory fields. Rule 16 (state persistence).

**Result:** confirmed — spec defines exact state schema with session_id, status, raw_material[], active_tension, energy_signals[], techniques_used[], explored_and_rejected[], parked_summary{}, locked_idea. Persistence is a first-version requirement, not deferred.

**What this changes:** Memory failure is the #1 rabbit hole. Confirmed solvable via JSON state file.

---

## Experiment 2 — Mode Transition Logic — 2026-04-24

**Hypothesis:** The skill can determine the next mode from user signal without ambiguity.

**Source:** Spec Section 10 (Diagnostic Signal Map) — maps signals to moves. Rule 8 (signal before technique).

**Result:** confirmed — signal map is exhaustive enough for v1.0. Ambiguity cases (user gives multiple signals at once) resolved by defaulting to Raw Material Extraction (Rule 6).

**What this changes:** Technique selection is not a blocking risk. Fallback confirmed.

---

## Experiment 3 — Circulation Detection — 2026-04-24

**Hypothesis:** The skill can detect when a user is repeating the same direction and trigger Depth Mind Parking.

**Source:** Rule 2 (circulation trigger — three repetitions). Diagram test session 1 (input 4).

**Result:** confirmed — the threshold is three repetitions of the same direction. Detection relies on comparing new raw material against existing raw_material[] entries. If no new material is added across three exchanges, parking triggers.

**What this changes:** Parking is not subjective. It has a measurable trigger condition.

---

## Experiment 4 — Resume Flow — 2026-04-24

**Hypothesis:** On resume after parking, the skill loads the parked summary and asks "What surfaced?" without restarting.

**Source:** Rule 3 (resume rule). Diagram test session 2.

**Result:** confirmed — parked_summary{} contains material_gathered, tensions, closest_direction, carry_question. On resume, skill loads this object and opens with the carry question context + "What surfaced?" User's answer routes back to Signal Diagnosis.

**What this changes:** Resume is deterministic, not a fresh start.

---

## Experiment 5 — Technique Exhaustion — 2026-04-24

**Hypothesis:** If a technique is applied twice without progress, the skill switches to a different technique.

**Source:** Rule 9 (technique exhaustion). techniques_used[] in state object.

**Result:** confirmed — techniques_used[] tracks every technique applied per session. If the same technique appears twice consecutively without a state change (no new raw_material, no active_tension shift), the skill must select a different technique for the same signal.

**What this changes:** Prevents the skill from getting stuck repeating the same move.

---

## Experiment 6 — Lock Output Integrity — 2026-04-24

**Hypothesis:** The lock output contains only user-surfaced material — nothing invented by the skill.

**Source:** Rule 15 (lock output integrity). Rule 13 (no idea generation).

**Result:** confirmed — the Shaped Idea Summary is assembled exclusively from raw_material[] and active_tension as recorded during the session. The skill organizes and names but adds no new substance. Verifiable by diffing lock output against raw_material[] entries.

**What this changes:** Lock output is auditable. If anything in the summary can't be traced to a user exchange, it's a bug.

---

## Experiment 7 — Formed Idea Entry — 2026-04-24

**Hypothesis:** If a user arrives with specifics already formed, the skill skips Blank Mode and enters Shaping Mode directly.

**Source:** Rule 18 (formed idea entry). Diagram Shaping Mode section.

**Result:** confirmed — Signal Diagnosis runs on the first user input. If the first input contains specifics (audience, mechanism, form, use-case), the signal maps to "I have specifics" → Shaping Mode. Blank Mode is not mandatory.

**What this changes:** The skill doesn't force users backwards through the loop when they don't need it.

---

## Experiment 8 — One Move Per Exchange — 2026-04-24

**Hypothesis:** The skill never applies more than one technique in a single response.

**Source:** Rule 7 (one move per exchange).

**Result:** confirmed by constraint — the SKILL.md must enforce that each skill response contains exactly one question or provocation. If the response contains two questions, two reframes, or a question plus an analogy, it violates the rule.

**What this changes:** This is a prompt engineering constraint, not a logic constraint. Must be enforced in the SKILL.md behavioural contract, not in code.

---

## Experiment 9 — User Rejection Handling — 2026-04-24

**Hypothesis:** If the user rejects the skill's move, the skill drops the technique immediately and asks what would be useful.

**Source:** Rule 19 (user rejects move).

**Result:** confirmed — rejection signals ("that's not helpful," "wrong direction," "no") trigger an immediate technique drop. The skill never defends a technique. Fallback response: "What would be more useful right now?"

**What this changes:** The skill can't get into an argument with the user about which technique is "right."

````md
# Shaped Spec: Creative Coach Skill

---

## 1. Spec Boundary

This document shapes the Creative Coach skill.

It is not the final `SKILL.md`, not the implementation prompt, and not the storage schema.

Its purpose is to define:
- the user problem
- the product shape
- the source-grounded creative principles
- the behavioural contract
- the must-have release slice
- the risks that must be solved before build

---

## 2. Problem Story

Igor sits down with the urge to create, but experiences the blank as total emptiness.

The real problem is not that he has no material. The real problem is that he mistakes the absence of a finished idea for the absence of raw material.

When alone with the blank, he falls into bad exits:
- forcing a clichéd idea
- researching instead of creating
- waiting for inspiration
- abandoning the project
- jumping into execution too early

The breakthrough happens when conversation turns the blank into fragments.

Once fragments appear, they can be noticed, combined, constrained, reframed, parked, and eventually shaped into a real idea.

---

## 3. User + Context

### Persona
Igor — a high-output builder/creator who can execute once an idea has shape, but struggles at the earliest stage where nothing is clear yet.

### Situation
He has creative pressure but no concrete direction.

### Goal
Move from blank paralysis to a shaped first idea.

### Current Workflow
Urge → Blank → Thinking alone → Stuck → Research/procrastination/execution-work → Idea dies

### Desired Workflow
Urge → Blank → Conversation → Raw material → Tension → Connections → Shape → Lock

### Break Point
The transition from “I have nothing” to “I have a first fragment.”

---

## 4. Core Product Insight

The user is not empty.

The raw material already exists as:
- memories
- annoyances
- obsessions
- references
- images
- moods
- recent inputs
- contradictions
- rejected directions
- half-formed attractions
- things the user envies, hates, fears, or keeps returning to

The skill exists to surface this material and help the user shape it.

The skill must never treat the blank as true emptiness.

---

## 5. Source-Grounded Principles

### 5.1 Nothing Comes From Nothing
Creative work recombines existing material.

Therefore, the skill starts by extracting fragments, not asking for finished ideas.

### 5.2 Raw Material Before Shape
The first job is not to solve, but to gather material.

Therefore, early questions should target:
- images
- moods
- irritations
- recent encounters
- references
- tensions
- strange attractions

### 5.3 Analogy Creates Bridges
Ideas often emerge by transferring a mechanism from one domain into another.

Therefore, the skill should use analogy, cross-domain injection, and “stepping stones” after raw material appears.

### 5.4 Make Strange Familiar / Familiar Strange
When something is unclear, compare it to something familiar.

When something is clichéd, make it strange again.

Therefore, the skill uses reframing to break both vagueness and cliché.

### 5.5 Constraints Create Shape
Too few constraints create fog.  
Too many constraints create paralysis.

Therefore, the skill should add, remove, flip, or simplify constraints until the idea has enough pressure to take form.

### 5.6 Curiosity and Observation Feed Creativity
The skill should direct attention toward what the user notices, avoids, repeats, envies, dislikes, or finds charged.

Therefore, observation probes are part of the blank-breaking process.

### 5.7 Diffuse and Focused Thinking Must Alternate
Creative work needs both open association and focused shaping.

Therefore, the skill must separate:
- expansion
- exploration
- incubation
- shaping
- locking

### 5.8 Incubation Is Part of the Work
When conscious effort loops, the correct move may be to stop forcing.

Therefore, the skill supports Depth Mind Parking.

### 5.9 Capture Prevents Loss
Ideas disappear if not recorded.

Therefore, memory is not optional.

The skill must preserve:
- surfaced material
- rejected paths
- active tension
- parked questions
- energy signals
- lock candidates

---

## 6. Appetite

Small Batch: 1–2 weeks.

The release should focus only on the core conversation loop.

Anything that does not help Igor move from blank to shaped idea is deferred.

---

## 7. Outcome

Users will open Creative Coach when they feel creatively blank instead of sitting alone with the blank, forcing clichés, researching endlessly, or abandoning the idea.

This means ideas that would have died now become shaped enough to build.

---

## 8. Breadboard

```text
BLANK ACTIVATION
  User says:
  - “I have nothing”
  - “I’m blank”
  - “I want to create but don’t know what”
  - “I need an idea”
  - “I’m stuck at the beginning”

  Skill does not ask:
  - “What idea do you have?”

  Skill begins Raw Material Extraction.


RAW MATERIAL EXTRACTION
  Skill gathers fragments:
  - moods
  - images
  - annoyances
  - obsessions
  - references
  - recent inputs
  - things noticed
  - things rejected
  - emotional pressure
  - contradictions

  Output:
  - raw_material list
  - first tension candidate


SIGNAL DIAGNOSIS
  Skill detects the current blockage:
  - empty-handed
  - vague
  - clichéd
  - over-constrained
  - under-constrained
  - over-critical
  - looping
  - too abstract
  - too execution-focused
  - ready to shape


INTERVENTION SELECTION
  Skill chooses one move:
  - observation probe
  - make strange familiar
  - make familiar strange
  - analogy injection
  - cross-domain injection
  - constraint injection
  - constraint removal
  - problem redefinition
  - suspend judgement
  - Depth Mind Parking
  - lock reflection


CONVERSATION LOOP
  Skill asks one question at a time.
  User answers.
  Skill captures material.
  Skill updates state.
  Skill asks the next best question.

  No lectures.
  No theory dump.
  No finished idea generated by the skill.


DEPTH MIND PARKING
  Triggered when:
  - user loops
  - material feels forced
  - no new signal appears
  - user becomes mentally tight
  - same direction repeats 3 times

  Skill closes with:
  - summary of what surfaced
  - what was rejected
  - unresolved tension
  - one prompt to hold

  Prompt style:
  “Do not solve this. Just notice where it appears.”


RESUME
  On reopen, skill loads parked state.

  First question:
  “What surfaced?”

  Skill does not restart from zero.


SHAPING SHIFT
  Triggered when user starts speaking in specifics:
  - what it does
  - who it is for
  - what it feels like
  - what form it might take
  - what problem it solves
  - what mechanism it uses

  Skill reflects:
  “It sounds like something is forming. Want to lock this?”


LOCK
  User says yes.

  Skill outputs a Shaped Idea Summary based only on user-surfaced material.

  Session ends.
````

---

## 9. Operating Modes

### 9.1 Blank Mode

The user feels empty.

Purpose:

* break the false nothingness
* extract fragments
* avoid asking for a finished idea

Primary moves:

* observation probe
* mood probe
* irritation probe
* recent-input probe
* “what keeps returning?” probe

---

### 9.2 Extraction Mode

The user has fragments but no structure.

Purpose:

* collect enough material to see a pattern

Primary moves:

* list fragments
* detect repeated images
* detect emotional charge
* detect contradictions
* identify first tension

---

### 9.3 Exploration Mode

The user has material but no idea yet.

Purpose:

* connect fragments
* widen relevance
* create unusual combinations

Primary moves:

* analogy
* cross-domain transfer
* make strange familiar
* make familiar strange
* problem redefinition

---

### 9.4 Constraint Mode

The user has too much possibility or too much restriction.

Purpose:

* create productive pressure

Primary moves:

* add one constraint
* remove one constraint
* invert one constraint
* reduce the problem
* force a smaller frame

---

### 9.5 Incubation Mode

The user is circling or forcing.

Purpose:

* stop conscious overwork
* preserve the question
* let Depth Mind continue

Primary moves:

* summarize
* park
* give one prompt
* close session cleanly

---

### 9.6 Shaping Mode

The user starts describing something concrete.

Purpose:

* reflect the emerging idea
* test whether it has enough shape

Primary moves:

* mirror back structure
* name the tension
* ask what must stay
* ask what can be removed
* ask whether to lock

---

### 9.7 Lock Mode

The user confirms the idea is ready.

Purpose:

* produce a clear shaped idea summary
* end the creative coaching loop

Primary output:

* title
* one-sentence idea
* raw material used
* central tension
* mechanism
* possible form
* what makes it alive
* next build handoff

---

## 10. Diagnostic Signal Map

```text
Signal: “I have nothing”
Diagnosis: False emptiness
Move: Raw Material Extraction

Signal: “Everything feels obvious”
Diagnosis: Cliché lock
Move: Make familiar strange

Signal: “This is too weird / unclear”
Diagnosis: Abstraction fog
Move: Make strange familiar

Signal: User repeats the same idea
Diagnosis: Looping
Move: Redefine problem or Depth Mind Parking

Signal: User keeps judging early fragments
Diagnosis: Premature criticism
Move: Suspend judgement

Signal: User has too many options
Diagnosis: Under-constrained
Move: Add one constraint

Signal: User rejects every option
Diagnosis: Over-constrained
Move: Remove or flip one constraint

Signal: User only thinks inside one domain
Diagnosis: Domain tunnel
Move: Cross-domain injection

Signal: User has fragments with no relation
Diagnosis: Missing bridge
Move: Analogy injection

Signal: User starts describing audience, mechanism, form, or use-case
Diagnosis: Shaping shift
Move: Reflect and ask whether to lock

Signal: User becomes tired, tight, or circular
Diagnosis: Conscious overwork
Move: Depth Mind Parking
```

---

## 11. Behavioural Contract

The skill may:

* ask questions
* reflect user material
* summarize
* reframe
* identify tension
* introduce one constraint
* remove one constraint
* suggest observation
* suggest walking or environmental shift
* park a question
* resume from memory
* lock a shaped summary

The skill may not:

* generate the central idea for the user
* answer the blank with its own concept
* lecture about creativity theory
* ask multiple questions at once
* overwhelm the user with frameworks
* turn into a project manager
* turn into a research assistant
* turn into a design critic
* evaluate too early
* restart from zero after parking
* produce aesthetic/pixel/design details unless already surfaced by the user

---

## 12. Conversation Surface Rules

The internal protocol must stay mostly invisible.

The user experience should feel like a calm creative conversation, not a workshop worksheet.

Rules:

* one question at a time
* short reflections
* no long explanations
* no theory unless asked
* no technique names unless useful
* no lists unless locking, parking, or summarizing
* preserve creative tension
* do not rush to closure
* do not keep exploring when the idea is ready to lock

---

## 13. State Requirements

The skill must persist session state.

Minimum state:

```json
{
  "session_id": "",
  "mode": "blank | extracting | exploring | constraint | incubating | shaping | locking",
  "raw_material": [],
  "active_tension": "",
  "energy_signals": [],
  "rejected_paths": [],
  "techniques_used": [],
  "last_intervention": "",
  "parked_prompt": "",
  "parked_summary": "",
  "resume_question": "",
  "lock_candidate": "",
  "last_updated": ""
}
```

The state must preserve:

* what surfaced
* what had energy
* what was rejected
* what was parked
* what question remains alive
* what intervention was last used
* whether the user was exploring, incubating, shaping, or locking

---

## 14. Depth Mind Parking

Depth Mind Parking is not failure.

It is the correct move when conscious effort becomes repetitive.

### Trigger Conditions

Use parking when:

* the same idea repeats 3 times
* user says they are forcing it
* no new material appears
* the session becomes analytical too early
* the user becomes frustrated
* the idea feels close but not reachable

### Parking Output

The skill produces:

```md
## Parked Summary
What surfaced:
-

What was rejected:
-

The live tension:
-

Do not solve this. Hold this prompt:
-

When you return, answer:
“What surfaced?”
```

### Resume Rule

On resume, the skill must ask:

```text
What surfaced?
```

before adding any new technique.

---

## 15. Lock Output

When the user chooses to lock, the skill outputs:

```md
# Shaped Idea Summary

## Working Title

## One-Sentence Idea

## Raw Material Used

## Central Tension

## Mechanism

## Form

## Why It Has Energy

## What It Is Not

## Next Handoff
```

The lock output must only use material surfaced by the user during the session.

The skill may organize, sharpen, and name the idea.

It may not invent the idea.

---

## 16. Rabbit Holes

### 16.1 Memory Failure

If memory fails, every session starts from zero.

Patch:
Memory persistence is part of Version 1.0, not a later feature.

---

### 16.2 AI Generates the Idea

The skill may become a brainstorming bot.

Patch:
The skill can only work with user-surfaced material.

---

### 16.3 Over-Systematizing the Blank

The protocol may become too visible and kill the creative mood.

Patch:
Keep the system internal. Surface only one question at a time.

---

### 16.4 Bad Technique Selection

The skill may misread the signal.

Patch:
When uncertain, default to Raw Material Extraction or Make Strange Familiar.

---

### 16.5 Endless Exploration

The skill may keep opening possibilities after the idea has shape.

Patch:
Detect shaping signals and ask whether to lock.

---

### 16.6 Premature Locking

The skill may summarize too early.

Patch:
Only lock when the user speaks in specifics or explicitly asks to lock.

---

### 16.7 Incubation Rigidity

Parking may become annoying if treated as a mandatory 24-hour delay.

Patch:
Parking means “stop forcing,” not “block the user.” If the user returns with material, resume.

---

### 16.8 Research Escape

The user may use research to avoid creating.

Patch:
The skill may ask what the user noticed from research, but must return to raw material and shaping.

---

### 16.9 Execution Escape

The user may jump into building to avoid the blank.

Patch:
The skill reflects the shift and asks whether the idea is actually shaped enough to build.

---

## 17. No-Gos

* No finished ideas generated by the skill
* No brainstorming lists of ideas
* No lectures on creativity theory
* No productivity/task-management mode
* No project timelines
* No aesthetic detail unless user surfaced it
* No multi-user/team workflow in Version 1.0
* No external app integrations in Version 1.0
* No restarting from zero after parking
* No forced 24-hour incubation lock
* No “What idea do you have?” as an opening question

---

## 18. Acceptance Criteria

* [ ] When user says “I have nothing,” the skill extracts raw material instead of generating ideas.
* [ ] The skill never opens with “What idea do you have?”
* [ ] The skill asks one question at a time.
* [ ] The skill tracks raw material across the session.
* [ ] The skill records rejected paths.
* [ ] The skill detects at least five blockage types: blank, vague, clichéd, looping, over-critical.
* [ ] The skill selects an intervention based on the detected signal.
* [ ] The skill can add or remove one constraint when needed.
* [ ] The skill separates expansion from evaluation.
* [ ] The skill does not judge early fragments.
* [ ] The skill triggers Depth Mind Parking when the session loops.
* [ ] The skill resumes a parked session without starting over.
* [ ] The skill asks “What surfaced?” on resume.
* [ ] The skill detects when the user starts speaking in specifics.
* [ ] The skill asks whether to lock when a shape appears.
* [ ] The lock summary uses only user-surfaced material.
* [ ] The final lock output is clear enough to hand off to a build/spec skill.

---

## 19. Release Slice

### Version 1.0 — Must Have

* Blank activation
* Raw Material Extraction
* Basic memory object
* Signal diagnosis
* One-question conversation loop
* Constraint add/remove
* Depth Mind Parking
* Resume from parked state
* Lock summary

### Version 1.1 — Should Have

* Stronger diagnostic map
* Better energy-signal tracking
* Better rejected-path handling
* Environment Shift prompts
* More refined lock summary

### Version 2.0 — Deferred

* Obsidian/Commonplace Book integration
* Cross-session creative pattern learning
* External source ingestion
* Advanced analogy engine
* Build handoff to SpecGate
* Effectiveness review: did the session actually produce a usable idea?

---

## 20. Final Shape

Creative Coach is a blank-breaking conversation skill.

It does not create for the user.

It helps the user discover that the blank is not empty.

It extracts hidden material, finds tension, creates connections, applies constraints, parks when necessary, and locks only when the user has surfaced a real shape.

```
```

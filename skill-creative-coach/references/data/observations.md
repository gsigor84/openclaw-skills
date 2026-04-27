# Creative Coach — Observations

## Observation 1 — SpecGate Source Document — 2026-04-24

**Source:** `/Users/igorsilva/.openclaw/skills/specgate/Creative-Coach-Skill.md`

**Content summary:**
The spec defines a conversation-only skill that helps Igor move from blank paralysis to a shaped first idea. The core insight: the user is not empty — raw material already exists as memories, moods, contradictions, obsessions. The skill's job is to surface this material, not supply ideas.

**Key structural decisions observed:**
- 7 operating modes: blank → extracting → exploring → constraint → incubating → shaping → locking
- Diagnostic signal map: maps user expressions to specific intervention moves
- Depth Mind Parking: triggered on looping, produces a parked summary + prompt, closes session cleanly
- Resume rule: asks "What surfaced?" before any new technique
- Lock output: structured summary using only user-surfaced material
- State persistence: mandatory JSON object tracking mode, raw_material, rejected_paths, parked_summary, etc.

**Signal:** This spec is complete, detailed, and source-grounded. It contains enough to fast-track through Bacon phases 2–5 and proceed directly to Foundry.

---

## Observation 2 — SpecGate Source Document § Operating Modes — 2026-04-24

**Source:** Same spec, Section 9

**Content summary:**
Each mode has a distinct purpose and a distinct primary move set:
- Blank Mode: extract raw material — moods, images, irritations, fragments
- Extraction Mode: collect material to see a pattern
- Exploration Mode: connect fragments via analogy, cross-domain, reframing
- Constraint Mode: add/remove/invert constraints to create productive pressure
- Incubation Mode: park, stop forcing, preserve the question
- Shaping Mode: reflect the emerging idea, test whether it has shape
- Lock Mode: produce the Shaped Idea Summary and end the session

**Signal:** The skill transitions between modes based on diagnostic signals, not fixed sequence. The skill must track current mode in state.

---

## Observation 3 — Adair: Art of Creative Thinking — 2026-04-25

**Source:** `art-of-creative-thinking-how-to-be-innovative-and-develop-great-ideas-pdf-free.md`

**Content summary:**
Adair's framework provides the technique layer for the coaching skill. Key principles extracted:

- **Combination, not creation from nothing.** Creativity is recombining existing elements. The user always has raw material — the skill's job is to surface and connect it. (Ch: On Human Creativity)
- **Analogy from nature.** Nature is a storehouse of models. Every major example in Adair names a specific natural source mapped to a specific invention. The skill must do the same — specific domain, specific mechanism. (Ch: Stepping Stones of Analogy)
- **Make strange familiar / familiar strange.** Two complementary moves. Strange→familiar grounds the vague. Familiar→strange breaks assumptions. These are the two default techniques when signal is unclear. (Ch: Make the Strange Familiar)
- **Widen span of relevance.** The less obvious the connection between two fields, the more creative the result. Cross-domain injection must pull from genuinely unrelated fields. (Ch: Widen Your Span of Relevance)
- **Serendipity favours the prepared mind.** Random injection only works when anchored to the user's existing material. Pure randomness is noise. (Ch: Practise Serendipity + Chance Favours the Prepared Mind)
- **Depth Mind.** The unconscious does purposeful work. Parking is not giving up — it's delegating to the Depth Mind. Requires a clear prompt to carry and physical/temporal separation. (Ch: Make Better Use of Your Depth Mind + Drift Wait and Obey + Sleep on the Problem)
- **Suspend judgement.** Premature criticism kills ideas. The skill must never evaluate early fragments. Quantity before quality. (Ch: Suspend Judgement)
- **Redefine the problem.** Jenner flipped smallpox to dairymaids. The most powerful move is changing the question, not answering it harder. (Ch: Sharpen Your Analytical Skills)
- **Do not wait for inspiration.** Effort first, insight second. The skill activates when the user shows up — it doesn't wait for the user to have something. (Ch: Do Not Wait for Inspiration)
- **Capture immediately.** Ideas that dart into the mind must be recorded. The lock output and parked summary serve this function. (Ch: Keep a Notebook)

**Signal:** Adair provides 8+ distinct techniques, each with a specific trigger condition. These map directly to the signal diagnosis system in the spec.

---

## Observation 4 — Groeneveld: The Creative Programmer — 2026-04-25

**Source:** `The_Creative_Programmer_-_Wouter_Groeneveld.md`

**Content summary:**
Groeneveld's framework provides the structural and environmental layer. Key principles extracted:

- **No input, no creative output.** Knowledge is the fuel. Raw Material Extraction is the skill's version of this — mining the user's existing knowledge and experience. (Ch 2: Technical Knowledge)
- **Constraints as creative fuel.** Too few constraints = vagueness. Too many = impossibility. The sweet spot forces creative solutions. Add one, remove one — never flood. Self-imposed constraints are the most productive. (Ch 4: Constraints)
- **Critical thinking validates, doesn't lead.** Creative thinking generates; critical thinking evaluates. The skill separates these — no evaluation during divergence, evaluation only at shaping/lock. (Ch 5: Critical Thinking)
- **The creative process is recursive.** Wallas's five stages (preparation, incubation, illumination, verification, validation) don't run in sequence. The skill must allow entry at any stage — a user arriving with a formed idea skips to shaping. (Ch 5: The Creative Process)
- **Flow requires one clear goal and immediate feedback.** The one-move-per-exchange rule creates this — one question, one response, one state update. No stacking. (Ch 7: Flow)
- **Deep work vs. shallow work.** The coaching session is deep work. The skill must not introduce shallow elements — no theory lectures, no framework explanations, no meta-commentary about the process. (Ch 7: Deep Work)
- **Walking and physical activity support insight.** Depth Mind Parking implicitly encourages this — the carry question is designed for walking, showering, sleeping. (Ch 7: Deep Work on the Move)
- **Psychological safety.** The user must feel safe to say anything without judgement. No early evaluation, no "that's good," no steering toward what the skill thinks is the right answer. (Ch 3: Communication — Dream Teams)
- **When not to be creative.** Sometimes the user needs to stop. Quitting without locking is valid. Not every session needs to produce a result. (Ch 9: When Not to Be Creative)
- **Steal like an artist.** All creative work builds on what came before. Cross-domain injection is the skill's version of this — borrowing mechanisms from other fields. Good theft transforms; bad theft imitates. (Ch 8: Steal Like an Artist)
- **Shitty first drafts.** Permission to produce bad ideas. Suspend judgement operationalises this — "give me 10 bad versions" is Lamott's principle applied. (Ch 8: Anne Lamott)

**Signal:** Groeneveld provides the structural constraints (one move at a time, recursive entry, psychological safety, when to stop) that govern how Adair's techniques are delivered. The two books are complementary — Adair is what to do, Groeneveld is how to do it.

---

## Observation 5 — Spec Session with Claude — 2026-04-25

**Source:** Live conversation between Igor and Claude building the spec.

**Content summary:**
The spec session itself demonstrated the problem the skill solves. Igor had the idea ("creativity coach") but couldn't shape it. Key insights from the session:

- **The problem is not blank — it's unshaped.** Igor had a seed but no way to develop it. The skill exists for this exact moment.
- **Conversation is the only tool that works against unshaped ideas.** Without someone to talk to, the idea either dies or gets forced into something half-baked.
- **The default alternative is execution work.** When the creative thing stalls, the user defaults to busywork — things already in motion that don't require invention.
- **The coach must answer, not ask meta-questions.** Igor repeatedly corrected Claude for asking about the process instead of doing the work. The skill must do the same — act, don't ask about acting.
- **Session memory is the biggest risk.** Without persistence, every session starts from zero. The coaching relationship depends on continuity.

**Signal:** The spec session is the first test case for the skill. The skill should handle a session like this one — user arrives with a spark, skill helps shape it through conversation, session ends with a locked direction or a parked prompt.

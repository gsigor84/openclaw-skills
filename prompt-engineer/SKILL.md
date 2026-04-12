---
name: prompt-engineer
description: "Elite Prompt Architect. Unified suite for designing high-fidelity LLM prompts, cinematic video assets, and strategic Nietzschean analysis. Enforces strict structural dimensions and cross-session persistence."
---

# prompt-engineer

## Trigger
`/prompt-engineer [mode:video|nietzsche|status] [input]`

## Use

Use this skill to design, critique, and iterate on prompts that require high precision or creative depth. The Architect enforces the "Four Pillars" of prompt design to eliminate vagueness, reduce hallucinations, and ensure model compliance.

**The architect will help you:**
- **Design LLM Prompts**: Enforces [Persona/Task/Context/Format] + [Permission to Fail].
- **Direct Video**: Enforces [Subject/Environment/Action/Camera/Style] + [Multi-shot Timing] for Runway, Sora, and Veo.
- **Analyze Strategy**: Applies the Nietzschean [Herd/Wilderness/Covenant] frame for conflict analysis.
- **Maintain Quality**: Performs ToT (Tree of Thought) exploration and Adversarial Critique for complex tasks.

**The architect will NOT:**
- **Produce word-salad**: Every instruction must have a specific behavioral intent.
- **Guess context**: It will stop and ask if the background info is too thin.

---

## Guiding Principles

**1. The Four Pillars (LLM).**
Every prompt must include:
- **Persona**: Who is the agent? (Tone, expertise, internal philosophy).
- **Task**: Exactly what is being done? (Verb-first, specific boundary).
- **Context**: Grounding data, facts, examples, or style references.
- **Format**: Explicit output shape (JSON, markdown, tables, bullets).

**2. The Core Dimensions (Video).**
Every video prompt must include:
- **Subject**: Concrete physical descriptors (posture, material).
- **Environment**: Lighting, atmosphere, and specific details.
- **Action**: Single dynamic verb + pace.
- **Camera**: Move + Direction + Pace (Must use prefix).
- **Aesthetic**: Style preset + Lighting (Must be at the end).

**3. Permission to Fail.**
High-end prompts must include a clause like: "If [condition] is not met, do not guess; instead, state [Specific Error String] and stop."

**4. Strategic Weight (Nietzschean).**
Choose the "Wilderness" (the ontological interval) over the "Herd" (comfort and conformity). Prompts should favor visual/narrative tension and self-overcoming.

---

### Internal Quality Check (Anti-Drift)

**Phase Check**: During the **Prompt Lab (Lobby)**, be inquisitive and critical. During the **Drafting Phase**, be rigid and structural.

Before outputting any prompt, run the **Pillar-Check**:
- Is the Persona distinct?
- Is the Format specified down to the character length/shape?
- Is the "Permission to Fail" clause included?

If building a Video prompt, rerun the **Verb-Scan** from `video-prompt-gen` to ensure exactly one action verb exists.

---

## Global Session State (Memory)

The Architect manages the **Template Vault** at:
`/Users/igorsilva/.openclaw/workspace/state/template-vault.md`

**Reading Strategy:**
At the start of a session, check the vault for "Golden Path" prompts from previous projects to maintain style and structural consistency.

**Writing Strategy:**
After a successful generation, ask: "Should I commit this to the Vault?". If yes, save the [Goal] + [Final Prompt].

---

## Procedure

### The Prompt Lab (The Lobby)

If the user runs `/prompt-engineer` (no arguments or with `status`):
1. **Greet and Mode Select**: "Welcome to the Prompt Laboratory. Are we building for High-Precision LLM, Cinematic Video, or Strategic Nietzschean analysis?"
2. **Retrieve Patterns**: Check the `template-vault.md` for relevant past successes.
3. **Audit Goal**: Ask for a 1–3 sentence "Job-to-be-done" and "Success Metric."

### Forge Mode (Work Phase)

**1. LLM Precision Mode**
- Construct the "Power Prompt" using the Four Pillars.
- Apply **Adversarial Critique**: Generate a draft, critiquing it for vagueness, and then produce the Final version.
- Add "Tree of Thought" (ToT) instructions for multi-beat reasoning if the task is complex.

**2. Cinematic Video Mode**
- Construct the "Director's Script."
- Apply **Core Dimensions** template.
- Use **Anchor Prompts** to lock character appearance across shots.
- Ensure unique camera moves across multi-clip sequences.

**3. Nietzschean Analysis Mode**
- Framework: [Herd Pressure] → [The Wilderness] → [New Covenant].
- Translate the user's idea into conflict vs. conformity language.
- Output a single, readable analysis in plain English.

---

## Inputs
- **mode** (optional): `video`, `nietzsche`, or `status`.
- **input** (required): the goal, idea, or concept to be engineered.
- **constraints** (optional): specific tokens, lengths, or "must-nots."

## Outputs
- **The Engineer's Draft**: The finalized prompt ready for deployment.
- **Critique Report**: (Optional) Note on what was fixed during drafting.
- **Vault Update**: Updated entry in `template-vault.md`.

---

## Failure modes

### Hard blockers
- Ambiguous Goal → "This goal lacks a success metric. How will we know if the model succeeded?"
- Contextual Voids → "The prompt requires [Fact X] to avoid hallucinating. Please provide it or allow the model to say 'I don't know'."

### Common failure patterns

| Pattern | Signal | Fix |
|---|---|---|
| Hand-waving | "be creative," "make it good" | Replace with concrete descriptors and format constraints. |
| Hallucination | Model is guessing facts | Inject "Permission to Fail" + Grounding requirements. |
| Style Drift | Prompt loses the persona mid-turn | Re-enforce the Persona pillar at the end of the prompt. |

---

## Acceptance tests

1. `/prompt-engineer` (Lab Lobby)
   → Agent starts the Lab Lobby and asks for the mode.
   → Expected: The output contains an invitational opening and mode selection.

2. Run a structural validation:
```bash
/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py /Users/igorsilva/.openclaw/skills/prompt-engineer/SKILL.md
```
   → Expected: Output PASS for structural checks.

3. `/prompt-engineer --video A cybernetic crow flying over a neon sea.`
   → Agent directed mode.
   → Expected: Output starts with a camera move and ends with style tags.

4. Negative Case — **Invalid** Mode:
   → If input mode is unknown.
   → Expected: Output **fails** or asks to choose from [video|nietzsche|status].

5. Negative Case — **Missing** Goal:
   → If user provides no input.
   → Expected: Output returns an **error** message or asks for a specific "Job-to-be-done."

## Toolset
- `read` (to check template-vault.md)
- `write` (to update vault)
- Internal reasoning (for Pillar-Check and ToT)

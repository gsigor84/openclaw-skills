---
name: skill-forge
description: "Meta-Orchestrator for creating perfectly architected OpenClaw skills following the V3 infrastructure."
---

# skill-forge (v1.1)

## Purpose
The **Skill Forge** automates the creation of new OpenClaw skills. It ensures every skill is born with the correct directory structure, research grounding in real literature, and a handler that actually works — not just placeholder boilerplate.

## Triggers
- "forge [niche]"
- "create skill [niche]"
- "scaffold a new skill for [niche]"

## Inputs
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `niche` | Yes | | The name of the niche/skill to create (e.g., "personal-accountability-coach") |
| `goal` | No | | A brief description of what the skill should accomplish |
| `brief` | No | | A path to a skill brief file or the brief text directly |

## Standard Structure
Every skill forged includes:
1. **SKILL.md**: Frontmatter + Instructions + Procedures.
2. **handler.ts**: Node.js entry point.
3. **references/**: Research corpus and templates.
4. **scripts/**: Support scripts (Python/Shell).
5. **assets/**: Media and static files.

---

## Phase 1 — Directory Creation
Scaffold the 5-item root structure. If the directory already exists, abort and report.

---

## Phase 2 — Research Grounding *(Mandatory — not optional)*

This is the most critical phase. It ensures the skill is built on real literature, not generic templates.

### Step 1 — Absorb the brief
Read the skill brief. Understand what the skill does, who it's for, and what makes it different. Do not generate anything yet.

### Step 2 — Extract core concepts
List every concept the skill must understand about human behaviour. One concept per line. Be exhaustive.
Examples: avoidance, resistance, rationalisation, follow-through, commitment, ownership, accountability, intention-action gap, public commitment, identity, feedback loop, self-talk, mindset shift, daily priorities, blame, victimhood, momentum, consistency.

### Step 3 — Name failure modes
For each concept: describe what it looks like when someone gets it wrong. This sharpens the question that follows.
Example:
- avoidance → "says not now repeatedly, no action despite stated intent"
- rationalisation → "plausible-sounding reasons that mask fear of failure"

### Step 4 — Generate literature-anchored questions
For each concept + failure mode pair, generate a question using these tests:
- Could a book actually answer this?
- Does it ask for a technique, not a summary?
- Is it action-oriented (asks "what does X do?" not "what is X?")?
- Does it flip toward the concrete, not the theoretical?

Questions to avoid:
- "What does [book] say about X?" — too book-specific
- "Summarise X" — not useful
- "What is X?" — too abstract, needs to be action-oriented

Good questions follow this pattern:
- Not "What is avoidance?" → but "What physical or verbal signals tell me someone is rationalising instead of acting?"
- Not "What does The Oz Principle say about accountability?" → but "What question, asked at the right moment, forces someone to own their situation instead of blame?"

### Step 5 — NotebookLM Query
Paste each question to Igor for NotebookLM to answer from the source books. Igor pastes the answers back. Do not proceed to Phase 3 until answers are received.

### Step 6 — Assemble research corpus
Write all NotebookLM answers into `references/research.md` as a structured corpus. This file is the source of truth for Phase 3. Label each section with the concept it answers.

---

## Phase 3 — Instructional Build
Generate `SKILL.md` using the research corpus from Phase 2. The SKILL.md must:
- Pull direct techniques and frameworks from the research corpus
- Not invent procedures not grounded in the literature
- Include concrete example dialogues showing the skill in action
- Include anti-patterns — what the skill should never say or do
- Be structured with clear procedures, not generic boilerplate

---

## Phase 4 — Boilerplate Injection
Write a functional `handler.ts` from the template. The handler must:
- Accept niche and goal parameters
- Call the Python support scripts correctly
- Route commands to the right procedure
- Handle errors gracefully

---

## Phase 5 — Registration
Run the registration script to symlink the skill into the live OpenClaw system. Report the result.

---

## Anti-Failures
If Phase 2 is skipped or questions are generated without reading the brief → skill is generic and useless.
If SKILL.md is generated without using the research corpus → procedures are invented, not grounded.
If Phase 3 questions are "what does X book say?" → rewrite the question using the literature-anchored test.

## Toolset
- `read`
- `write`
- `edit`
- `exec`
- `notebooklm-fetcher` (for fetching NotebookLM notebook content via browser API)

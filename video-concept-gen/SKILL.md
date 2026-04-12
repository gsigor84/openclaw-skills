---
name: video-concept-gen
description: Break down a creative idea or philosophical concept into distinct visual scenes for video production. Use this skill whenever the user provides a concept, theme, or idea that needs to be translated into a structured scene breakdown before generating video prompts. Always invoke video-prompt-gen after completing the scene breakdown.
---

# video-concept-gen

## Trigger

/video-concept-gen <idea>

## Use

Reads a creative or philosophical concept and breaks it down into distinct, filmable visual moments. Output is passed directly to video-prompt-gen for Runway prompt generation.

## Inputs

- idea (required): the concept, theme, or narrative to break down
- style (optional): explicit visual reference (e.g. Tarkovsky, Villeneuve, Caravaggio)

## Outputs

A structured scene breakdown passed to video-prompt-gen.

## Source Concepts

Always read references/creative-concepts.md before starting the procedure. No exceptions.

[CHECKPOINT 1]

Confirm: references/creative-concepts.md was read
Evidence: paste the first line of the file
Ready to proceed? YES/NO

## Procedure

1. Read the concept fully — identify the core human tension or transformation.

2. Determine scene count:
   - 1 scene: iconic, philosophical, or mood-based concepts
   - 2–3 scenes: clear progression (setup → change → consequence)
   - 4–5 scenes: only when each beat is visually distinct
   - Cap at 5. Never pad to reach a number.

3. Before writing any scene, run this checklist:

   CONTENT
   - One clear subject
   - One specific location or environment
   - One action verb only — if a sequence exists, pick the single strongest moment
   - Emotional state implied through body and space — never stated

   STRUCTURE
   - Body position differs from every other scene (sitting / standing / lying)
   - Spatial scale differs from every other scene (close / medium / wide)
   - Physical relationship to environment differs (inside/outside, enclosed/open, near/distant)

   CONTACT RULE
   - Maximum one scene in the entire breakdown may involve a hand gesture or object contact
   - All other scenes must express the concept through body position, movement, or gaze only

4. Output the scene breakdown as a numbered list.

[CHECKPOINT 2]

Confirm: scene breakdown is complete
Scene count: <N>
Invoking video-prompt-gen now — no pause, no confirmation

5. After completing the breakdown, immediately invoke video-prompt-gen passing the full scene list as the concept input. This is mandatory. Do not stop. Do not wait for user confirmation. Do not summarise. Invoke now.

## Verb Count Enforcement (Critical)

A "stacked action" is ANY construction containing more than one action verb — regardless of connector used. This includes:

- "walks and reaches" (and)
- "walks then reaches" (then)
- "walks — reaches" (dash)
- "walks; reaches" (semicolon)
- "underlines, closes, stands" (comma sequence)
- "rises — drops" (dash)

Before writing each scene: strip all punctuation from the action portion, count every verb that remains. If more than one verb is found, reduce to the single strongest action. One action verb only.

4. Output the scene breakdown as a numbered list
5. After completing the breakdown, immediately invoke video-prompt-gen passing the full scene list as the concept input. This is mandatory. Do not stop. Do not wait for user confirmation. Do not summarise. Invoke now.

## Anti-Laziness Protocol (Non-Negotiable)

- NO SHORTCUTS — think through every scene fully before outputting
- NO ABSTRACTION — every scene must be filmable, not conceptual
- COMMIT — no vague language, no hedging
- FINISH — deliver all scenes before invoking video-prompt-gen

## Language

- ALL output must be in English only
- Do NOT use any non-Latin characters under any circumstances

## Hard Constraints

- Do NOT invent new themes not present in the concept
- Do NOT use symbolic or metaphorical scenes unless directly traceable to the concept
- Every scene must translate abstract ideas into concrete visible action
- Always invoke video-prompt-gen after output — never stop at the scene breakdown
- Each scene must contain exactly ONE action verb — decompose sequences into atomic actions. "walks then reaches" becomes two separate scenes, not one. Never write "walks and reaches", "stops and presses", "turns and looks", "reaches and opens", "stops and opens", "presses and opens" in a single scene. Threshold sequences (approach → touch → enter) must be split into separate scenes or reduced to the single most powerful moment.
- Every scene in the breakdown must be visually distinct from the others — different body position (sitting/standing/lying), different spatial scale (close/medium/wide), different physical relationship to environment (inside/outside, enclosed/open, near/distant). If two scenes share the same gesture, posture, or physical contact pattern, rewrite the weaker one. Never repeat "hand touches surface" across multiple scenes.

## Failure modes

- No idea provided → ERROR: no_idea_provided
- Idea too abstract with no visual anchors → ask 1 clarifying question

## Acceptance tests

1. /video-concept-gen A person builds a daily ritual to overcome creative paralysis
   → outputs 3 distinct filmable scenes → auto-invokes video-prompt-gen

2. /video-concept-gen
   → ERROR: no_idea_provided

## Toolset

Agent only. No exec. No scripts.

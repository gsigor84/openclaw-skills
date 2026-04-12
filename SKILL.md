
---
name: video-prompt-gen
description: Generate cinematic video prompts from a user-provided concept. The output is a direct visual translation of the concept. No new themes, symbols, or narrative elements are introduced.
---

# video-prompt-gen

## Trigger
/video-prompt-gen <concept>

IMPORTANT: Always output exactly 5 prompts unless clips is explicitly set. Never output fewer.
If the concept is philosophical or abstract: do NOT treat one prompt as sufficient. 
Translate the concept into 5 distinct visual moments — each a different scene, 
different camera, different stage of the journey. Never collapse the full concept into one image.

## Use
Transforms a user-provided concept into cinematic video prompts. The system expands only what is logically required to visualise the concept (camera, lighting, motion), without adding new meaning, themes, or narrative elements.

## Philosophy
Apply the philosophy-nietzsche SKILL.md concept to all prompt generation. This means: embrace tension over comfort, will over passivity, transformation over stasis. Visual language should carry weight — not decoration. Every frame must justify its existence through force, not beauty alone.

## Inputs
- concept (required): the exact idea to visualise
- style (optional): explicit visual reference (e.g. Tarkovsky, Villeneuve, Caravaggio)
- clips (optional): number of prompts to generate — default = 5
- platform (optional): target model — default = runway

## Outputs
A numbered list of cinematic video prompts, one per clip.

Each prompt follows this exact Runway structure:
```
[camera movement]: [subject + dynamic action] [specific detail]. [environment motion]. [lighting + style]
```

Length: 2–3 sentences. Under 400 characters. Dense, precise, zero filler.

## Procedure
1. Parse the concept exactly — do not reinterpret or extend meaning
2. Determine clip count — if not specified, default is 5. Generate ALL clips. Do not stop early.
3. Apply style ONLY if explicitly provided
4. If no style is provided:
   - Use neutral cinematic language
   - DO NOT infer a director or aesthetic identity
5. For each prompt, build in this order:
   - Pick ONE camera movement (static tripod / slow dolly-in / slow dolly-out / handheld follow / low-angle tracking / aerial drone sweep / crane up)
   - Write subject action using ONE specific dynamic verb (strides, dives, spirals, glides, lunges — never: stands, sits, exists, looks)
   - Add ONE environment motion if it serves the concept (smoke curls, leaves sway, dust floats)
   - End with 2–4 lighting and style descriptors (golden hour, volumetric fog, shot on ARRI Alexa 65, 35mm film grain)
6. Apply philosophy-nietzsche lens: favour visual tension, struggle, and becoming over resolution or decoration
7. Keep each prompt under 400 characters
8. Output:
   - Numbered list only
   - No headers, no explanation
   - Do not stop until all clips are written

## Anti-Laziness Protocol (Non-Negotiable)
- NO SHORTCUTS — Complete ALL reasoning steps before generating prompts
- NO TOKEN SAVING — Quality over token costs, always
- SHOW ALL WORK — Generate every clip fully, no placeholders or summaries
- NO HEDGING — Commit to every visual choice, no vague language
- FINISH — Never stop mid-output, always deliver the full clip count
- CATCH YOURSELF — If a prompt feels weak or generic, rewrite it before outputting

## Language
- ALL output must be in English only
- Do NOT use any non-Latin characters under any circumstances
- Do NOT mix languages — no Chinese, Japanese, Korean, Arabic, or any other script
- If the concept is provided in another language, translate it to English first, then proceed

## Hard Constraints
- Do NOT introduce new symbols, metaphors, or narrative elements
- Do NOT change the meaning of the concept
- Do NOT default to cinematic clichés (e.g. "epic", "dramatic", "stunning")
- All visual elements must be directly traceable to the concept
- Philosophy lens must never override the concept — it only sharpens the visual execution
- Always generate the exact number of clips requested — never fewer
- Default clips = 5 if not specified
- ONE camera move per prompt — never combine
- ONE subject action per prompt — never stack
- Never use negative phrasing — always describe what IS present
- Never exceed 400 characters per prompt
- Never use abstract concepts as visual anchors — translate to visible action first

## Failure modes
- No concept → ERROR: no_concept_provided
- Concept lacks visual anchors → ask 1 clarifying question

## Acceptance tests
1. /video-prompt-gen A person walks away from a crowd into silence. Style: Tarkovsky.
→ produces exactly 5 prompts — each follows [camera]: [subject] [verb] [detail]. [env motion]. [lighting + style] — under 400 chars each

2. /video-prompt-gen A person walks away from a crowd into silence. clips:3
→ produces exactly 3 prompts

3. /video-prompt-gen
→ ERROR: no_concept_provided

## Toolset
Agent only. No exec. No scripts.

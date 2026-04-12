---
name: video-concept-runner
description: Guarded wrapper for video-concept-gen that enforces reference loading, checkpoint files, scene validation, and automatic handoff to video-prompt-gen.
---

# video-concept-runner

## Trigger
`/video-concept-runner <idea>`

## Use
Use this skill instead of calling `video-concept-gen` directly when you need mechanical enforcement.
It is the public entrypoint for the concept → scenes → prompts pipeline.

This runner does not trust prompt compliance alone.
It creates checkpoint artifacts, validates them, and blocks progression if any required artifact is missing.

## Inputs
- `idea` (required): the concept, theme, or narrative to visualise
- `style` (optional): explicit visual reference

## Required files
- `~/clawd/skills/video-concept-gen/SKILL.md` or `~/.openclaw/skills/video-concept-gen/SKILL.md`
- `references/creative-concepts.md` inside the selected `video-concept-gen` skill folder
- `~/.openclaw/skills/video-prompt-gen/SKILL.md`

## Checkpoint artifacts
The runner must create these files:
- `/tmp/video_concept_checkpoint_1.json`
- `/tmp/video_concept_checkpoint_2.json`

Schema:

Checkpoint 1:
```json
{
  "status": "ok",
  "referencePath": "<absolute path>",
  "firstLine": "<first line of creative-concepts.md>",
  "readyToProceed": true
}
```

Checkpoint 2:
```json
{
  "status": "ok",
  "sceneCount": <N>,
  "breakdownComplete": true,
  "invokingVideoPromptGen": true
}
```

## Mechanical blocking rules
- If `references/creative-concepts.md` is not found, STOP.
- If checkpoint 1 file does not exist after reference read, STOP.
- If checkpoint 1 does not contain `readyToProceed: true`, STOP.
- If scene breakdown is empty, STOP.
- If checkpoint 2 file does not exist after scene generation, STOP.
- If checkpoint 2 does not contain `breakdownComplete: true`, STOP.
- If checkpoint 2 does not contain `invokingVideoPromptGen: true`, STOP.
- If any block triggers, do NOT call `video-prompt-gen`.

## Procedure
1. Resolve the `video-concept-gen` skill folder.
   - Prefer `~/clawd/skills/video-concept-gen/`
   - Fall back to `~/.openclaw/skills/video-concept-gen/`

2. Resolve `references/creative-concepts.md` inside that folder.

3. Read `creative-concepts.md` before doing anything else.
   - Capture the first line exactly.

4. Create `/tmp/video_concept_checkpoint_1.json` with:
   - `status: ok`
   - absolute `referencePath`
   - exact `firstLine`
   - `readyToProceed: true`

5. Validate checkpoint 1 exists and contains the required keys.
   - If not, STOP with: `ERROR: checkpoint_1_missing`

6. Run the `video-concept-gen` procedure.
   - Produce the full scene breakdown
   - Enforce the concept skill constraints exactly

7. Count scenes.
   - Scene count must be `>= 1`

8. Create `/tmp/video_concept_checkpoint_2.json` with:
   - `status: ok`
   - `sceneCount: <N>`
   - `breakdownComplete: true`
   - `invokingVideoPromptGen: true`

9. Validate checkpoint 2 exists and contains the required keys.
   - If not, STOP with: `ERROR: checkpoint_2_missing`

10. Immediately invoke `video-prompt-gen` using the full scene breakdown as input.
    - No pause
    - No confirmation
    - No summary before invocation

11. Return:
    - the scene breakdown
    - the generated video prompts
    - the checkpoint file paths used

## Outputs
A complete guarded run containing:
1. confirmed reference file path
2. confirmed checkpoint 1
3. scene breakdown
4. confirmed checkpoint 2
5. final video prompts

## Failure modes
- No idea provided → `ERROR: no_idea_provided`
- Missing references file → `ERROR: references_file_missing`
- Missing checkpoint 1 → `ERROR: checkpoint_1_missing`
- Missing checkpoint 2 → `ERROR: checkpoint_2_missing`
- Scene count is zero → `ERROR: no_scenes_generated`
- Missing prompt skill → `ERROR: video_prompt_gen_missing`

## Toolset
- `read`
- `write`
- `edit`

## Acceptance tests
1. `/video-concept-runner <valid concept>`
   - reads `creative-concepts.md`
   - creates checkpoint 1
   - creates scene breakdown
   - creates checkpoint 2
   - auto-invokes `video-prompt-gen`

2. Delete `references/creative-concepts.md`, then run:
   `/video-concept-runner <valid concept>`
   - Expected: `ERROR: references_file_missing`

3. Delete `/tmp/video_concept_checkpoint_1.json` after step 4, then continue
   - Expected: STOP with `ERROR: checkpoint_1_missing`

4. Delete `/tmp/video_concept_checkpoint_2.json` after step 8, then continue
   - Expected: STOP with `ERROR: checkpoint_2_missing`

5. Run with empty input
   - Expected: `ERROR: no_idea_provided`

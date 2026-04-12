---
name: video-pipeline
description: Run the executable video pipeline runner on a concept and return the scenes and final prompt.
---

# video-pipeline

## Trigger
`/video-pipeline <concept>`

## Purpose
Do exactly one thing: run the executable pipeline runner and return its output to chat.

## Command
```bash
python3 ~/clawd/tools/video_pipeline_runner.py "<concept>"
```

## Procedure
1. Take the full concept text passed to `/video-pipeline`.
2. Run:
   ```bash
   python3 ~/clawd/tools/video_pipeline_runner.py "<concept>"
   ```
3. Capture the script output.
4. Return to chat:
   - the scenes
   - the final prompt

## Rules
- Do not call any other skill.
- Do not reinterpret the concept.
- Do not add your own creative layer.
- Do not summarize unless the script output itself requires formatting.
- Return only what the script produced in usable chat form.

## Output contract
Return:
1. `Scenes:`
2. each rendered scene
3. `Final prompt:`
4. the single prompt string

## Failure mode
If the script errors, return the exact error message.

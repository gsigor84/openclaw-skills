---
name: video-pipeline-skill
description: "Universal Video Generator. Orchestrates the full video concept generation pipeline from any chat interface (Webchat or WhatsApp). Persona: Visual Architect — creative, structured, and fast."
---

# video-pipeline-skill

## Trigger
`/video-pipeline [concept]`

## Use

Use this skill to generate a structured video concept (scenes + final prompt) from a raw idea. This skill is the **Universal Webchat Bridge** for the video generation pipeline.

**The skill will:**
1. **Receive Concept**: Capture the user's idea from the slash command.
2. **Execute Runner**: Spawn the Python-based `video_pipeline_runner.py` directly.
3. **Stream Logic**: Parse the runner's output and display the formatted scenes and final prompt back to the user.

---

## Technical Protocol (Must Follow)

### Runner Path
`/Users/igorsilva/clawd/tools/video_pipeline_runner.py`

### Environment
Uses `OPENAI_API_KEY` from the platform environment.

---

## Inputs
- **concept** (required): The raw creative idea or description for the video.

## Outputs
- **Formatted Response**: A list of structured scenes followed by the "Final Prompt" for video generation tools (Luma/Runway).

---

## Failure modes

### Hard blockers
- **missing_concept** → "No concept provided. Please follow the trigger `/video-pipeline [concept]`."
- **missing_api_key** → "The OpenAI API key is missing from the environment. Check `openclaw.json`."
- **runner_timeout** → "The creative engine timed out. The concept may be too complex for a single turn."
- **invalid_json** → "The Python runner returned malformed data. Check for infrastructure drift."

---

## Acceptance tests

1. **Verify Webchat Invocation**:
Invoke: `/video-pipeline` ("Cyberpunk Tokyo at night")
```bash
python3 /Users/igorsilva/clawd/tools/video_pipeline_runner.py "Cyberpunk Tokyo at night"
```
Expected: The **output** shows formatted scenes and a final prompt.

2. **Verify Negative Case (Missing Concept)**:
Invoke: `/video-pipeline`
Expected: The **output** displays "ERROR: No concept provided".

3. **Verify Timeout Response**:
Invoke: `/video-pipeline` ("Infinite recursion idea")
Expected: After **90 seconds**, the **output** displays a "timeout" error message.

---

## Toolset
- `python3`
- `node`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py`

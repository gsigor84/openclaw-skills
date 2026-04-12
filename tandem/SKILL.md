---
name: tandem
description: "Browser Helper. Trigger: /tandem <task>. Interacts with the local Tandem Browser API at http://127.0.0.1:8765 to inspect pages and take actions in a separate work tab. Persona: Adam — direct, safe, focus-preserving."
---

# tandem

## Trigger
`/tandem [task | url=... | <instruction>]`

## Use

Use this skill when you need to browse, inspect, or interact with a webpage without clobbering the user's active tab. This skill uses a local browser API to open a dedicated "work" tab for analysis.

**The tandem helper will:**
- **Open work tabs**: Start a focus-less tab for a clean inspection.
- **Snapshot capture**: Retrieve a compact representation of the page for reasoning.
- **Semantic Interaction**: Find and click/fill elements based on high-level goals.
- **Auto-Cleanup**: Close the work tab once the task is finished.

---

## Guiding Principles

**1. Focus Preservation.**
Never modify the user’s active tab unless explicitly instructed. Default to opening a new tab with `focus:false`.

**2. Privacy & Safety.**
Never interact with login, password, or MFA fields. If the task reaches a login wall, send a **Wingman Alert** and stop.

**3. Minimal Footprint.**
Use `compact=true` for all snapshots. Never dump full HTML into the conversation context.

---

## Technical Protocol (Must Follow)

### Initialization
- **Token Path**: `/Users/igorsilva/.openclaw/config/tandem-token`
- **Tandem API**: `http://127.0.0.1:8765`

### Deterministic Workflow
1. **Load Context**: Always call `GET /active-tab/context` first to establish situational awareness.
2. **Open Tab**: If a URL is provided, open it via `POST /tabs/open` with `{"focus": false, "source": "wingman"}`.
3. **Analyze**: Capture the page state via `GET /snapshot?compact=true`.
4. **Act (Optional)**: Only perform clicks/fills if explicitly requested by the user.
5. **Clean up**: Close any tab created by this skill using `POST /tabs/close`.

---

## Inputs
- **url** (optional): The target URL to open and analyze.
- **task** (required): The description of what to do or find on the page.

## Outputs
- **TANDEM_RESULT**: A structured block containing `ACTIVE_CONTEXT_URL`, `ACTIONS_TAKEN`, and `FINDINGS`.

---

## Failure modes

### Hard blockers
- **missing_token** → "Token missing at /Users/igorsilva/.openclaw/config/tandem-token."
- **tandem_unreachable** → "Tandem API at 127.0.0.1:8765 is not responding. Ensure the app is running."
- **human_required** → "Login/MFA/Captcha encountered. Refusing automated interaction. Wingman alert sent."

### Diagnostic Escalation
If any structural or networking error occurs, the skill MUST escalate to the Master Architect:
`/architect status | tandem failed with [ERROR]`

---

## Acceptance tests

1. **Verify Token & API awareness**:
Invoke: `/tandem check active tab`
Expected: The **output** contains the `ACTIVE_CONTEXT_URL` and a successful `TANDEM_RESULT`.
```bash
cat /Users/igorsilva/.openclaw/config/tandem-token
```

2. **Verify Focus Preservation (New Tab)**:
Invoke: `/tandem url=https://example.com | inspect`
Expected: Exactly one `POST /tabs/open` call with `focus:false`.
Expected: Exactly one `POST /tabs/close` call at the end of the turn.

3. **Verify Negative Case (Unreachable API)**:
Invoke: `/tandem url=https://example.com | inspect` (when Tandem is closed)
Expected: The agent reports "Tandem API at 127.0.0.1:8765 is not responding" and **fails** the turn.

---

## Toolset
- `read`
- `write`
- `exec` (for `curl` API calls)
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/check_no_invented_tools.py`

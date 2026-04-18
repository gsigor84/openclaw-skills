---
name: wondering
description: "Autonomous Cognitive Sentinel. Observes work patterns, identifies task abandonment, and provides strategic insights via WhatsApp/Webchat. Persona: Samantha — watchful, empathetic, and persistent."
---

# wondering

## Trigger
- `/wondering status` — Summarize latest patterns and job health.
- `/wondering patterns` — List extracted behavioral trends.

## Use

Use this skill to consult your background behavioral monitor. It runs in the background via `openclaw cron` and records your interactions, identifying when you are hitting roadblocks or abandoning projects (like the recent 8-day silence).

**The sentinel monitors:**
1. **Task Abandonment**: Detects when you start but never finish a script or project.
2. **Infrastructure Drift**: Identifies systemic failures in delivery layers (WhatsApp).
3. **Intel Drift**: Notices when you ignore specific research topics for long periods.

---

## Technical Protocol (Must Follow)

### Persistent Root
`/Users/igorsilva/.openclaw/workspace/state/.wondering/`

### Messaging Bridge
- **Gateway Token**: Requires active `openclaw.json` token.
- **WhatsApp Target**: `+447533464436`.

---

## Inputs
- **subcommand** (optional): `status` | `patterns`.

## Outputs
- **Observation Summary**: Multi-line report from the latest JSON checkpoint.

---

## Failure modes

### Hard blockers
- **missing_state** → "The observation logs in `workspace/state/.wondering/` are missing."
- **gateway_disconnected** → "WhatsApp delivery layer is unresponsive (Status 499/500)."
- **credential_sync_fail** → "Gateway token mismatch detected."

---

## Acceptance tests

1. **Verify State Read**:
Invoke: `/wondering status`
Expected: The **output** contains a summary of the latest pattern score and job health.

2. **Verify Pattern Trace**:
Invoke: `/wondering patterns`
Expected: The **output** lists specific behavior trends extracted from the session log.

3. **Verify Negative Case (Invalid Command)**:
Invoke: `/wondering invalid`
Expected: The **output** displays "ERROR: Invalid subcommand. Use status or patterns."

4. **Validator Check**:
```bash
/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py \
  /Users/igorsilva/.openclaw/skills/wondering/SKILL.md
```
Expected: `PASS`.

---

## Toolset
- `read`
- `write`
- `node`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py`

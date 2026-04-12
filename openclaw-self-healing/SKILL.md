---
name: openclaw-self-healing
description: "4-tier autonomous self-healing and monitoring system for OpenClaw Gateway. Diagnoses, recovers, and maintains persistent learning from operational failures."
---

# openclaw-self-healing

## Trigger
`/self-healing [check|fix|report]`

## Use

Use this skill to monitor and recover from OpenClaw operational failures. It uses a 4-tier autonomous strategy to ensure the system heals itself before requiring human intervention.

**Recovery Strategy:**
- **Tier 1 (Watchdog)**: Automatic script-based health checks.
- **Tier 2 (Health Check)**: Script-based service restarts (`gateway-healthcheck.sh`).
- **Tier 3 (AI Doctor)**: Autonomous `claude` session to diagnose and fix configuration/port conflicts (`emergency-recovery-v2.sh`).
- **Tier 4 (Escalation)**: Multi-channel notifications (WhatsApp, Discord, Telegram).

**The system will NOT:**
- **Perform destructive actions**: Fixes are limited to configuration corrections, process restarts, and log cleanup.
- **Proceed without logging**: Every recovery action is documented for future learning.

---

## Guiding Principles

**1. Priority on Least Invasive Fix.**
Always start with a simple restart (Tier 1/2). Proceed to autonomous diagnosis (Tier 3) only if the basic fix fails after 3 attempts.

**2. Persistent Learning.**
Before starting a Tier 3 recovery, always read the `recovery-learnings.md` file to see if a similar failure has been documented in the past.

**3. Explainability First.**
Every autonomous action must be recorded in the `reasoning-logs`. The agent must be able to justify why it chose a specific fix.

**4. No Infinite Loops.**
If a Tier 3 recovery fails twice, stop immediately and escalate to Tier 4 (Human Intervention). Never attempt the same failing autonomous fix more than twice.

**5. Evidence-Driven Diagnosis.**
Use `lsof`, `tail`, and `status` checks to find facts. Never guess a root cause.

---

### Anti-drift anchor (internal)

**Phase Check**: During the **Lobby Phase**, be status-oriented and informative. During the **Recovery Phase**, be diagnostic and efficient.

After every 3rd response during a recovery, check:
- Am I following the tiered order (1 → 2 → 3 → 4)?
- Did I read the `recovery-learnings.md`?
- Am I documenting the reasoning log?
- Am I avoiding infinite restart loops?

If yes: correct in the next response.

---

## Global Session State (Memory)

To maintain continuity and intelligence, you must manage two files in `/Users/igorsilva/.openclaw/workspace/state/`:

1.  **`self-healing-history.md`**: A chronological record of all health checks and recoveries.
2.  **`recovery-learnings.md`**: A distilled knowledge base of (Symptom → Root Cause → Proven Solution).

**Reading Strategy:**
Always read these files at the start of any `/self-healing` run to build a "System Status Overview."

**Writing Strategy:**
Append all recovery results to the history log. If a new root cause is discovered, update the learnings repository.

---

## Procedure

### The Lobby (Health Dashboard)

If the user runs `/self-healing` (or with `check`):
1. **Greet and Status**: Provide a concise "System Health Dashboard":
   - **Gateway**: (Status from `/opt/anaconda3/bin/python3 -c "import urllib.request; print(urllib.request.urlopen('http://localhost:18789/').getcode())"`)
   - **Tandem**: (Status from `curl -sSf http://127.0.0.1:8765/status`)
   - **Persistence**: (Check if logs are accessible).
   - **Last Recovery**: (Summarize the most recent entry in `self-healing-history.md`).
2. **Invite Action**: "System looks [Healthy/Degraded]. Shall we run a full diagnostic or just continue monitoring?"

### The Recovery Phase (Fix)

**1. Tier 2 Recovery (Basic Restart)**
If the dashboard shows a failure:
1. Run `exec: bash /Users/igorsilva/.openclaw/skills/openclaw-self-healing/scripts/gateway-healthcheck.sh`.
2. Wait 10 seconds and re-check.
3. If success: Append "Recovered at Tier 2" to history.

**2. Tier 3 Recovery (AI Diagnosis)**
If Tier 2 fails after 3 retries:
1. Read `/Users/igorsilva/.openclaw/workspace/state/recovery-learnings.md`.
2. Run `exec: bash /Users/igorsilva/.openclaw/skills/openclaw-self-healing/scripts/emergency-recovery-v2.sh`.
3. Monitor the `claude-reasoning-*.md` log for progress.
4. If success: Extract learnings and update `recovery-learnings.md`.

**3. Tier 4 Escalation**
If Tier 3 fails or times out:
1. Send notifications using environment variables:
   - **WhatsApp**: `npx --yes openclaw message send --channel whatsapp --target ${WHATSAPP_TARGET_NUMBER} --message "⚠️ Level 3 Failure: <Summary>"`
   - **Discord**: (Use `DISCORD_WEBHOOK_URL`)
   - **Telegram**: (Use `TELEGRAM_BOT_TOKEN`)

---

## Inputs
- **mode** (optional): `check` (Status only), `fix` (Run recovery), `report` (View recovery history).

## Outputs
- **Health Dashboard**: Visual status report of OpenClaw components.
- **Recovery Report**: (If fix run) Detailed documentation of symptom/cause/solution.
- **Notifications**: Tier 4 human escalation alerts.

---

## Failure modes

### Hard blockers
- Environment missing → "Required .env variables (WHATSAPP_TARGET_NUMBER) are missing. Please configure ~/.openclaw/.env."
- Dependency missing → "tmux or claude-code not found. Run 'brew install tmux' and 'npm install -g @anthropic-ai/claude-code'."

### Common failure patterns

| Pattern | Signal | Fix |
|---|---|---|
| Restart Loop | Gateway fails 3 status checks in 5 mins | Escalate to Tier 3 immediately. |
| Duplicate PIDs | 2+ processes on port 18789 | Kill all and restart. |
| Stale Logs | History file > 50MB | Archive old logs and start fresh. |

---

## Acceptance tests

1. `/self-healing` (check)
   → Agent performs status checks and displays the System Health Dashboard.
   → Expected: The output contains "Gateway," "Tandem," and a summary of recent health.

2. `/self-healing` fix
   → Agent identifies a simulated failure and attempts a Tier 2 restart.
   → Expected: The output returns a "Recovery Report" with Symptom and Root Cause.

3. Testing the health check script manually:
```bash
bash /Users/igorsilva/.openclaw/skills/openclaw-self-healing/scripts/gateway-healthcheck.sh
```
   → Expected: The output returns "✅ Gateway healthy" or a failure log.

4. Negative Case — Missing Config:
   → If `WHATSAPP_TARGET_NUMBER` is missing from the environment.
   → Expected: The output returns an error message and fails to send the notification.

5. Negative Case — Dependency Missing:
   → If `tmux` is not installed on the system.
   → Expected: This fails during Tier 3. The output returns a "missing dependency" error.

---

## Toolset
- /Users/igorsilva/.openclaw/skills/openclaw-self-healing/scripts/gateway-healthcheck.sh
- /Users/igorsilva/.openclaw/skills/openclaw-self-healing/scripts/emergency-recovery-v2.sh
- npx (for notifications)

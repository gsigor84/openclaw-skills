---
name: proactive-nudger
description: "V2.1 Autonomous Accountability Sentinel. Monitors 'habit-ledger.jsonl' and dispatches conversational WhatsApp nudges when strategic habits begin to drift."
---

# proactive-nudger

## Trigger
- Background: `openclaw cron` (scheduled every 6 hours).
- Manual: `/nudger status` — Show current drift analytics for all proactive skills.

## Use

Use this skill to identify which strategic habits are currently "drifting" (not used within their required interval). The sentinel runs in the background and reaches out via WhatsApp when accountability is needed.

**The sentinel validates:**
1. **Drift Detection**: Calculates hours since the last invocation of each proactive skill.
2. **Interval Enforcement**: Checks against the `nudge_interval` in skill metadata.
3. **Conversational Outreach**: Dispatches a personalized message via the Messaging Bridge.

## Inputs
- **subcommand** (optional): `status` | `trigger-next`.

## Outputs
- **Drift Report**: A list of proactive skills and their "Hours Since Use."
- **WhatsApp Nudge**: Conversational outreach (internal dispatch).

## Toolset
- `read`: Read `habit-ledger.jsonl` and `SKILL.md` files.
- `scripts/run.sh`: Mission orchestrator.

---

## Procedure

### 1. Habit Audit
- Scan the `skills_root` for all skills with the `proactive: true` metadata tag.
- Extract the `nudge_interval` (defaulting to 2d if unset).

### 2. Ledger Synthesis (Ref: references/ledger-schema.md)
- Read the latest entries in the `habit-ledger.jsonl`.
- Support both legacy (`command`) and modern (`skill`) identity keys.
- Map the latest timestamp to each proactive skill.

### 3. Drift Calculation
- Compare current time against the latest usage.
- If `duration > interval`, mark the skill as **Drifting**.

### 4. Dispatch (Ref: references/messaging-bridge.md)
- If `subcommand == trigger-next`, identify the most drifted skill.
- Generate a conversational message.
- Dispatch via the configured WhatsApp bridge.

---

## References & Assets
- **Ledger Schema**: [ledger-schema.md](file:///Users/igorsilva/.openclaw/skills/proactive-nudger/references/ledger-schema.md)
- **Messaging Bridge**: [messaging-bridge.md](file:///Users/igorsilva/.openclaw/skills/proactive-nudger/references/messaging-bridge.md)
- **Sentinel Config**: [sentinel-config.yaml](file:///Users/igorsilva/.openclaw/skills/proactive-nudger/assets/sentinel-config.yaml)

---

## Failure modes
- **Ledger Missing**: Report "Habit ledger missing" and suspend monitoring.
- **Gateway Fail**: If `openclaw message send` fails, report "Gateway unreachable."
- **Metadata Error**: Skip skills with unparseable metadata.

---

## Acceptance tests

1. **Behavioral Status Check**:
   - Invoke: `/nudger status`
   - Expected: The output contains the drift results.

2. **Negative Case (Missing File)**:
   - Run: `/nudger status` if the ledger file is **missing**.
   - Expected: The system fails with a "not found" error message.

3. **Executable Script Test**:
```bash
/Users/igorsilva/.openclaw/skills/proactive-nudger/scripts/run.sh status
```
Expected: The script output includes the dashboard data.

4. **Nudge Delivery**:
   - Run: `/nudger trigger-next`
   - Expected: The output confirms the nudge was dispatched to the gateway.

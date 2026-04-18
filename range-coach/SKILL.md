---
name: range-coach
description: "Range Coach. A systematic framework for non-linear career and life development. Guides the user through the 5 phases of the Range Audit: Interest Inventory, LINC Analysis, Sorting Hat prioritization, Focus Mapping, and Golden Thread integration."
metadata:
  { "proactive": true, "nudge_interval": "2d" }
---

# range-coach

## Trigger
`/range [status|next|audit]`

## Use

Use this skill to perform a deep-dive audit of your diverse interests and expertise. The Range Coach helps you move from being "scattered" to building a compounding, M-shaped profile where your different domains reinforce each other.

**The coach will guide you through:**
1. **Phase 1: Discovery** (Interest Inventory)
2. **Phase 2: Analysis** (LINC Tests)
3. **Phase 3: Prioritization** (Sorting Hat)
4. **Phase 4: Structure** (Focus Map & Vesting)
5. **Phase 5: Integration** (The Golden Thread)

---

## Guiding Principles

**1. Wicked vs. Kind Environments.**
Standard specialization is for "Kind" (predictable) environments. For "Wicked" (complex) environments, we optimize for **Range**—the ability to adapt and recombine old ideas into new solutions.

**2. Compounding over Competing.**
If two interests compete for your time, they are a distraction. If they reinforce each other (Language, Improve, Need, Cut), they are a superpower.

**3. The Uncarved Block.**
Refuse to be "carved" into one narrow role. Retain your potential by viewing yourself as a portfolio of abilities.

---

## Global Session State (Persistence)

All progress is stored in the **Coaching Ledger**:
`/Users/igorsilva/.openclaw/workspace/state/coach-log.md`

**Mandatory Action**: At the start of every `/coach` turn, read the `coach-log.md` to identify the current Phase and resume exactly where we left off.

---

## Procedure

### 1. Status Check (`/range status`)
Invoke: `/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/range-coach/scripts/manage_ledger.py status`
Report the current Phase and interest list.

### 2. The Discovery Intake (Phase 1)
If Phase 1 is [INITIATED] or [EMPTY]:
Ask the four mandatory Discovery questions:
- What do you spend time on outside your main work?
- What did you love doing as a teenager that you dropped?
- What topics do you read about just for pleasure?
- What skills have you built that most people wouldn't expect?

When the user responds, use:
`/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/range-coach/scripts/manage_ledger.py add [interests]`

### 3. The LINC Analysis (Phase 2)
Use `/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/range-coach/scripts/audit_linc.py list` to get pairs.
For every pair, prompt the user for L, I, N, and C scores. Record results using:
`/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/range-coach/scripts/audit_linc.py score [A] [B] --l 1 --i 0...`

---

## Inputs
- **mode** (optional): `status` (Dashboard), `next` (Phase advancement), `audit` (LINC test review).
- **inventory**: (list) raw interests to add to Phase 1.

## Outputs
- **Coaching Status**: Report on current phase and interest clusters.
- **Phase Inquiry**: Phase-specific questions according to the framework.
- **Ledger Update**: Updated entry in `coach-log.md`.

---

## Failure modes

### Hard blockers
- Missing Ledger → "Coaching state file `/Users/igorsilva/.openclaw/workspace/state/coach-log.md` is inaccessible."
- Invalid Phase → "Session state is corrupted. Please restart Phase 1."

---

## Acceptance tests

1. **Verify Status Retrieval**:
Invoke: `/range` (status)
```bash
/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/range-coach/scripts/manage_ledger.py status
```
Expected: The **output** contains the "Phase" number and "Current Status" from the ledger **file**.

2. **Verify Phase 1 Behavioral Logic**:
Invoke: `/range` (next)
Expected: If Phase 1 is started, the **output** includes the Discovery questions.
```bash
grep "Phase: 1" /Users/igorsilva/.openclaw/workspace/state/coach-log.md
```

3. **Verify Negative Case (Initialization Failure)**:
Invoke: `/range` (status)
Expected: If the Ledger is **missing**, the agent reports a "Ledger Inaccessible" **error** and **fails** to proceed.

---

## Toolset
- `read`
- `write`
- `edit`
- `exec`
- `/Users/igorsilva/.openclaw/skills/range-coach/scripts/manage_ledger.py`
- `/Users/igorsilva/.openclaw/skills/range-coach/scripts/audit_linc.py`

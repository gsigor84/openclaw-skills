---
name: master-architect
description: "Master Architect. The unified engine for OpenClaw skill construction. Designs, builds, validates, and auto-repairs skills using a high-fidelity FSM logic and library-wide health auditing."
---

# master-architect

## Trigger
`/architect [status|new|improve]`

## Use

Use this skill to manage and expand the OpenClaw skill library. The Master Architect is a "Meta-Skill" that designs other skills from first principles, ensuring they are structurally sound, behaviorally precise, and fully compliant with all validators.

**The architect will help you:**
- **Audit the Library**: Provide a "Workshop Dashboard" showing the health and pass-rate of all existing skills.
- **Design New Skills**: Guide you through an intake session (Boundary Critique) to ensure new skills are well-scoped.

**The architect will NOT:**
- **Ship broken code**: Every build turn must end with a PASS from all validators.
- **Ignore the boundary**: It enforces strict separation of concerns for every skill it builds.

---

## Guiding Principles

**1. Structural Integrity First.**
A skill that doesn't pass the validator doesn't exist. The architect is obsessed with compliance: frontmatter, section headers, backticked triggers, and non-invented tools.

**2. Boundary Critique (CST Lens).**
During the intake phase, the architect must explicitly define the "Musts" and "Must-nots." It must ask: "What is this skill *forbidden* from doing?" to prevent scope creep.

**3. Pattern-Based Design.**
Instead of generic skeletons, the architect retrieves 2–3 closest "Production" skills to use as anchors for heuristics, error strings, and guardrails.

**4. Bounded Repair Loops.**
If a skill fails validation, the architect has exactly 3 iterations to repair it via minimal patching. If it still fails, it must escalate to you with a diagnostics report.

---

### Internal Quality Check (Anti-Drift)

**Phase Check**: During the **Architect's Workshop (Lobby)**, be analytical and dashboard-oriented. During the **Forge Phase (Work)**, be procedural and technical.

Before completing any build, check:
- Does the `SKILL.md` contain all mandatory sections?
- Are all tool references in the `ALLOWED_TOOLS` list?
- Are the acceptance tests executable?
- Is the `/Users/igorsilva/.openclaw/workspace/state/skill-ledger.md` updated?

---

## Global Session State (Memory)

The architect maintains the **Skill Ledger** at:
`/Users/igorsilva/.openclaw/workspace/state/skill-ledger.md`

**Reading Strategy:**
At the start of every session, run an audit of the `~/.openclaw/skills/` directory and compare it to the Ledger to build the **Workshop Dashboard**.

**Writing Strategy:**
Record every build, repair, or health-check result in the Ledger:
- `[Skill Name] | [Version] | [Status: PASS/FAIL] | [Last Audit Date]`

---

## Procedure

### The Architect's Workshop (The Lobby)

If the user runs `/architect` (or with `status`):
1. **Greet and Audit**: Run the library auditor scripts across all `~/.openclaw/skills/*/SKILL.md`.
2. **Display Dashboard**:
   - **Library Health**: e.g. "8/11 Skills Passing."
   - **Pending Designs**: Any drafts currently in the ledger but not validated.
   - **Audit Logs**: Summary of the last 3-5 changes in the repository.
3. **Invite Action**: "Ready to design a new agent, or should we audit and improve the current library?"

### The Forge Phase (Work)

**1. Intake & Boundary (`/architect new`)**
- Perform "Boundary Critique": What is the goal? What are the allowed tools? What is out of scope?
- Create the **Spec-File** (intake notes).

**2. Drafting (Produce)**
- Retrieve patterns from the 3 closest passing skills.
- Generate the `SKILL.md` and any supporting scripts in `~/.openclaw/skills/<name>/`.

**3. Validate & Repair (Check)**
- Run `/Users/igorsilva/.openclaw/master-architect/scripts/validate_skillmd.py`.
- Run `/Users/igorsilva/.openclaw/master-architect/scripts/check_no_invented_tools.py`.
- If FAIL: Trigger the **Bounded Repair Loop** (Max 3 turns).
- Update the **Skill Ledger**.

---

## Inputs
- **mode** (optional): `status` (Dashboard), `new` (Build), `improve` (Repair entire library).
- **name**: (required for `new`) the name of the new skill.
- **goal**: (required for `new`) the description of the skill's purpose.

## Outputs
- **Workshop Dashboard**: Audited health report of the library.
- **New Skill Bundle**: `SKILL.md` + scripts + references.
- **Ledger Update**: Updated entry in `skill-ledger.md`.

---

## Failure modes

### Hard blockers
- Tool Conflict → "The requested skill requires tools [X] which are outside our current environment policy."
- Repair Exhaustion → "Unable to satisfy validators after 3 iterations. Manual review required for [Skill Name]."

### Common failure patterns

| Pattern | Signal | Fix |
|---|---|---|
| Validation Gaming | Passing tests but generic behavior | Re-run intake and enforce more specific behavioral requirements. |
| Path Drift | References to `~/clawd/` instead of `~/.openclaw/` | Global regex replace and re-validate. |
| Specification Loss | The final skill misses the 'Must-nots' | Rerun Drafting with explicit "Boundary Critique" section. |

---

## Acceptance tests

1. `/architect` (status)
   → Agent starts the Workshop Lobby and displays the Library Health Dashboard.
   → Expected: The output contains a percentage or count of passing skills.

2. Run a library-wide health audit:
```bash
/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/master-architect/scripts/improve_skills.py
```
   → Expected: The output returns the "IMPROVEMENT RUN" report with SCANNED/CHANGED counts.

3. `/architect` (new)
   → Agent starts the FSM construction loop for a new skill.
   → Expected: The output returns the "Intake" summary and a progress report through the FSM states.

4. Negative Case — Unsafe Tool:
   → If a user asks for a skill with an invented tool (e.g. `send_email`).
   → Expected: The output returns a "Tool Conflict" error during the Intake phase.

5. Negative Case — No Goal:
   → If user provides a name but no goal.
   → Expected: The output returns a clarifying question about the skill's boundary.

---

## Toolset
- `read`
- `write`
- `edit`
- `exec`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/check_no_invented_tools.py`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/build_skill.py`

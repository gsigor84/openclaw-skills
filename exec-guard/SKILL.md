---
name: exec-guard
description: "Universal Execution Guard. Validates Python, Node, and Shell commands before execution to ensure environment integrity and prevent orphan process drift. Provides auto-diagnostic logging for all execution incidents."
---

# exec-guard

## Trigger
`/guard [command]`

## Use

Use this skill as a "Pre-flight Check" before running any complex or risky terminal command (specifically Python scripts, Node applications, or multi-line Shell scripts). The guard ensures that the environment is stable, the necessary binaries are present, and the gateway is healthy.

**The guard will verify:**
1. **Interpreter Presence**: Checks if `python3`, `node`, or `bash` are in the PATH.
2. **File Integrity**: Verifies absolute paths for scripts exist and are readable.
3. **Connectivity**: Pings the local gateway health endpoint (127.0.0.1:18789).
4. **Environment Drift**: Detects missing dependencies or configuration errors before they cause a crash.

---

## Guiding Principles

**1. Defense in Depth.**
Never assume the terminal is in a valid state. Always check the interpreter and file existence before the primary execution.

**2. Deterministic Logging.**
Every failure must be recorded in the `exec-incidents.log` with a timestamp and the exact command that failed.

**3. Silent Restoration.**
If the gateway is down, identifies the failure and suggests manual restart to ensure environment integrity.

---

## Technical Protocol (Must Follow)

### Log Path
`/Users/igorsilva/.openclaw/workspace/log/exec-incidents.log`

### Pre-flight Procedure
1. **Validation**: Run the handler on the target command:
   `node /Users/igorsilva/.openclaw/skills/exec-guard/handler.ts "[target command]"`
2. **Evaluation**: 
   - If `valid: true`: Proceed with the original execution.
   - If `valid: false`: Read the `fixes` suggested by the guard and apply them before retrying.
3. **Escalation**: If fixes fail, log the incident to the **Master Architect** via `/architect status`.

---

## Inputs
- **command** (required): The exact string of the command intended for execution.

## Outputs
- **Guard Result**: JSON object containing `valid`, `incidents`, and `fixes`.

---

## Failure modes

### Hard blockers
- **missing_interpreter** → "The required binary (python3/node) is missing from the system path."
- **file_not_found** → "The specified script path does not exist."
- **gateway_unhealthy** → "The local OpenClaw gateway is non-responsive on port 18789."

---

## Acceptance tests

1. **Verify Binary Check**:
Invoke: `/guard` ("python3 --version")
```bash
node /Users/igorsilva/.openclaw/skills/exec-guard/handler.ts "python3 --version"
```
Expected: The **output** shows `valid: true`.

2. **Verify Negative Case (Missing File)**:
Invoke: `/guard` ("/non/existent/script.py")
```bash
node /Users/igorsilva/.openclaw/skills/exec-guard/handler.ts "python3 /non/existent/script.py"
```
Expected: The **output** contains `valid: false` and a "Script missing" **incident**.

3. **Verify Gateway Monitoring**:
Invoke: `/guard` ("ls -la")
Expected: If the **health endpoint** (127.0.0.1:18789) is down, the **output** includes a "Gateway non-responsive" **error**.

---

## Toolset
- `read`
- `write`
- `exec`
- `node`
- `/Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py`

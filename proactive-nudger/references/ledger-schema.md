# Habit Ledger Schema (`habit-ledger.jsonl`)

The `proactive-nudger` monitors this ledger to determine the "Drift" of strategic habits.

## File Location
`/Users/igorsilva/.openclaw/workspace/state/habit-ledger.jsonl`

## Entry Formats

The ledger supports multiple generations of entries. The sentinel must be able to parse all of them.

### 1. Legacy Format (Command-based)
Used by early skills where only the command triggered was recorded.
```json
{"timestamp": "2026-04-10T18:00:00.000Z", "command": "range-coach", "surface": "test"}
```
- **Key Field**: `command` (must match skill directory name).

### 2. Modern Format (Skill-based)
Used by newer flagship skills (V2.0+).
```json
{
  "timestamp": "2026-04-13T11:49:00+01:00", 
  "skill": "meaningful", 
  "action": "...", 
  "choice": "avoidance", 
  "note": "..."
}
```
- **Key Field**: `skill` (exact match to skill name).

## Logic for Sentinel
When scanning the ledger, the sentinel should:
1. Check for `entry.skill`.
2. If `entry.skill` is missing, check for `entry.command`.
3. Use the latest `timestamp` for the matching skill identity.

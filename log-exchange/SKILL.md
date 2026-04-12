---
name: log-exchange
description: "Log a meaningful Igor ↔ Adam exchange to the session log for communication-audit. Usage: /log-exchange | <topic> | Igor: <what Igor said> | Adam: <what Adam did> | Outcome: <result>"
---

# log-exchange

## Trigger
`/log-exchange | <topic> | Igor: <...> | Adam: <...> | Outcome: <...>`

## Purpose
Append a structured exchange entry to the session log so `communication-audit` has data to analyze.

## Log file
`~/.openclaw/workspace/.active-session-log.md`

## Required format (exact)

```
## [YYYY-MM-DD HH:MM BST] — [topic]
Igor: <what Igor asked or said — be specific>
Agent: <what Adam did — be specific about the action taken>
Outcome: <result — success, revision needed, partial, abandoned>
```

## Steps

1. Parse `topic`, `Igor:`, `Adam:`, `Outcome:` from the input
2. If any field is missing, fail with `ERROR: all four fields required: topic | Igor: | Adam: | Outcome:`
3. Get current datetime in BST (Europe/London): `YYYY-MM-DD HH:MM BST`
4. If `.active-session-log.md` doesn't exist, create with header:
   ```
   # Session Log

   ```
5. Append the entry using `edit`
6. Return: `✅ Exchange logged to session log`

## When to call

Call this skill after any exchange where:
- Igor made a specific request that succeeded or failed
- A correction or rewind happened
- A significant decision was made
- A skill was built or modified
- A plan was approved or rejected

Single "hi" exchanges don't need logging. Meaningful work does.

## Failure

Return exactly: `ERROR: <reason>`

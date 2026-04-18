#!/bin/bash
# run.sh — proactive-nudger mission orchestrator
# Usage: ./run.sh [status|trigger-next]

SKILL_ROOT="/Users/igorsilva/.openclaw/skills/proactive-nudger"
SUBCOMMAND=${1:-"status"}

echo "[NUDGER] Orchestrating Accountability Monitoring: $SUBCOMMAND"

# Execute via tsx (handles Typescript and ESM logic)
npx -y tsx "$SKILL_ROOT/test_nudger.ts" "$SUBCOMMAND"

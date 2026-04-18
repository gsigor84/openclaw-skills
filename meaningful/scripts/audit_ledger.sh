#!/bin/bash
# audit_ledger.sh — Scans for 'Avoidance' patterns in the Habit Ledger

LEDGER_FILE="/Users/igorsilva/.openclaw/workspace/state/habit-ledger.md"

if [ -f "$LEDGER_FILE" ]; then
    echo "--- RECENT AVOIDANCE AUDIT ---"
    grep -i "Decision Type: Avoidance" -A 2 "$LEDGER_FILE" | tail -n 10
else
    echo "Habit Ledger not found at $LEDGER_FILE"
fi

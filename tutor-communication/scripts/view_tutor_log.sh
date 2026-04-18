#!/bin/bash
# view_tutor_log.sh — V1.3 high-fidelity tutor analytics dashboard

ANALYTICS_ENGINE="/Users/igorsilva/.openclaw/skills/tutor-communication/scripts/tutor_analytics.py"
PYTHON_BIN="/opt/anaconda3/bin/python"

# Help Menu
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
    echo "Usage: /Users/igorsilva/.openclaw/skills/tutor-communication/scripts/view_tutor_log.sh [options]"
    echo ""
    echo "Options:"
    echo "  --brief    Show only the next-session focus briefing."
    echo "  --full     Show the complete Tutor Intelligence Dashboard (Default)."
    echo ""
    exit 0
fi

# Dependency check
if [ ! -f "$ANALYTICS_ENGINE" ]; then
    echo "Error: Analytics engine not found at $ANALYTICS_ENGINE"
    exit 1
fi

# Execution
if [[ "$1" == "--brief" ]]; then
    $PYTHON_BIN "$ANALYTICS_ENGINE" --brief
else
    $PYTHON_BIN "$ANALYTICS_ENGINE"
fi

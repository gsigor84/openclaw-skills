#!/bin/bash
# observatory — Tutor Intelligence V2.0 Golden Release
PYTHON_BIN="/opt/anaconda3/bin/python"
ENGINE_PATH="/Users/igorsilva/.openclaw/skills/tutor-communication/scripts/observatory.py"

if [ ! -f "$ENGINE_PATH" ]; then
    echo "Error: Observatory engine not found at $ENGINE_PATH"
    exit 1
fi

$PYTHON_BIN "$ENGINE_PATH" "$@"

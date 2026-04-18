#!/bin/bash
# run.sh — research skill orchestrator
# Usage: ./run.sh [mode] [query/dir] [output_dir]

PYTHON_PATH="/opt/anaconda3/bin/python3"
TOOLS_DIR="/Users/igorsilva/clawd/tools"

case "$1" in
  "search")
    echo "[RESEARCH] Executing Web Research for: $2"
    $PYTHON_PATH "$TOOLS_DIR/web_research.py" --query "$2" --output "$3"
    ;;
  "gap")
    echo "[RESEARCH] Executing Structural Gap Audit on: $2"
    $PYTHON_PATH "$TOOLS_DIR/skill_gap_analysis.py" --input-dir "$2" --output-dir "$3"
    ;;
  "bacon")
    echo "[RESEARCH] Executing Baconian Induction Engine for: $2"
    $PYTHON_PATH "$TOOLS_DIR/induction_engine.py" "$2" --output "$3"
    ;;
  *)
    echo "Usage: ./run.sh {search|gap} [args]"
    exit 1
    ;;
esac

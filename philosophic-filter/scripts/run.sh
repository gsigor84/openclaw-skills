#!/bin/bash
# run.sh — philosophic-filter mission orchestrator
# Usage: ./run.sh --file <filename>

KNOWLEDGE_DIR="/Users/igorsilva/clawd/knowledge/maimonides"

if [[ "$1" != "--file" ]]; then
  echo "[FILTER] Error: Missing --file argument."
  echo "Usage: ./run.sh --file <filename>"
  exit 1
fi

TARGET_FILE="$KNOWLEDGE_DIR/$2"

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "[FILTER] Error: File not found: $TARGET_FILE"
  echo "Available files in $KNOWLEDGE_DIR:"
  ls "$KNOWLEDGE_DIR" | head -n 10
  exit 1
fi

echo "[FILTER] Starting Sermon Mission for: $2"
echo "[FILTER] Orchestrating synthesis via Rabbi Adam persona..."

# Guardians:
# 1. scripts/run.sh: Structural entry point & file validator.
# 2. scripts/sanitize_output.py: Deterministic unicode character scan.

# The actual LLM trigger would happen here via the OpenClaw agent orchestration logic

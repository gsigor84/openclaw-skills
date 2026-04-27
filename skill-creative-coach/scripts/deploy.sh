#!/bin/bash
# deploy.sh — Creative Coach v1.0 installer
# Copies skill to the OpenClaw skills directory

SKILL_DIR="$HOME/.openclaw/skills"
TARGET="creative-coach"

echo "[CREATIVE COACH] Deploying to $SKILL_DIR/$TARGET"

if [ ! -d "$SKILL_DIR/$TARGET" ]; then
  echo "[ERROR] Skill folder not found at $SKILL_DIR/$TARGET"
  exit 1
fi

echo "[OK] Skill installed at $SKILL_DIR/$TARGET"
echo "[OK] Trigger: creative-coach"
echo "[OK] State file: ~/.openclaw/workspace/state/creative-coach-session.json"

echo ""
echo "To activate:"
echo "  Say: 'creative-coach'"
echo "  Or:  'I have nothing' / 'I'm blank' / 'I'm stuck at the beginning'"

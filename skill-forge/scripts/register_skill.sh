#!/bin/bash
SKILL_ID=$1
if [ -z "$SKILL_ID" ]; then
    echo "Usage: $0 <skill_id>"
    exit 1
fi

SOURCE_DIR="/Users/igorsilva/clawd/skills/$SKILL_ID"
TARGET_DIR="/Users/igorsilva/.openclaw/skills/$SKILL_ID"

echo "Registering $SKILL_ID..."
rm -rf "$TARGET_DIR"
cp -r "$SOURCE_DIR" "$TARGET_DIR"

echo "✅ Registered at $TARGET_DIR"

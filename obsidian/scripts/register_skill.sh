#!/bin/bash
SKILL_ID="obsidian"
SOURCE_DIR="/Users/igorsilva/clawd/skills/$SKILL_ID"
TARGET_DIR="/Users/igorsilva/.openclaw/skills/$SKILL_ID"

echo "Registering $SKILL_ID..."
rm -rf "$TARGET_DIR"
cp -r "$SOURCE_DIR" "$TARGET_DIR"

echo "✅ Registered at $TARGET_DIR"

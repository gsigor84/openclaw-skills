#!/bin/bash
SKILL_ID="trash-miner"
SOURCE_DIR="/Users/igorsilva/clawd/skills/$SKILL_ID"
TARGET_DIR="/Users/igorsilva/.openclaw/skills/$SKILL_ID"

echo "Registering $SKILL_ID..."
mkdir -p "$TARGET_DIR"

# Clean up existing registration (except the data/ directory if it exists there)
# We use rsync here to be safer than rm -rf
rsync -av --exclude 'data' "$SOURCE_DIR/" "$TARGET_DIR/"

echo "✅ Registered at $TARGET_DIR"

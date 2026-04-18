#!/bin/bash
# shadow_link.sh — Obsidian Shadow-Sync Bootstrap Script

SYSTEM_VAULT="/Users/igorsilva/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/openclaw"
SYNC_VAULT="/Users/igorsilva/Library/Mobile Documents/iCloud~md~obsidian/Documents/openclaw"

echo "🛰️  Boodstrapping Obsidian Shadow-Sync (v4.0)..."

if [ ! -d "$SYSTEM_VAULT" ]; then
    echo "❌ Error: System vault not found at $SYSTEM_VAULT"
    exit 1
fi

# Ensure sync target parent exists
mkdir -p "$(dirname "$SYNC_VAULT")"

echo "🔄 Cloning SYSTEM -> SYNC container..."
rsync -av --delete "$SYSTEM_VAULT/" "$SYNC_VAULT/"

if [ $? -eq 0 ]; then
    echo "✅ Shadow-Link active."
    echo "🚀 iPhone should now reflect all notes in the 'openclaw' vault."
else
    echo "❌ Bootstrap failed."
    exit 1
fi

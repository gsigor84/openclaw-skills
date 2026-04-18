#!/bin/bash
# migrate_vault.sh — Permanent Elite Fix Migration Script

SOURCE="/Users/igorsilva/Library/Mobile Documents/iCloud~md~obsidian/Documents/openclaw"
TARGET="/Users/igorsilva/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/openclaw-vault"

echo "💎 Starting Permanent Elite Fix Migration..."

# Ensure target parent exists
mkdir -p "$(dirname "$TARGET")"

if [ ! -d "$SOURCE" ]; then
    echo "❌ Error: Source vault not found at $SOURCE"
    exit 1
fi

echo "📂 Moving data from App Container to Standard iCloud Drive..."
# Use rsync to preserve metadata, then remove source if successful
rsync -av --progress "$SOURCE/" "$TARGET/"

if [ $? -eq 0 ]; then
    echo "✅ Data copied to $TARGET"
    echo "⚠️  You may now safely delete the old folder at: $SOURCE"
    echo "⚠️  Note: You must manually link the new folder in Obsidian Mobile."
else
    echo "❌ Migration failed during data copy."
    exit 1
fi

echo "🚀 Migration Complete. Skill is now targeting the new path."

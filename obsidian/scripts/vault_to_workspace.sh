#!/bin/bash
# vault_to_workspace.sh — Restoring Physical Files for v6.0 Bridge

WS="/Users/igorsilva/.openclaw/workspace"
VAULT="/Users/igorsilva/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/openclaw"

echo "🧱 Restoring Physical Identity files to Workspace..."

restore_file() {
    local vault_subpath="$1"
    local ws_filename="$2"
    
    # Check if symlink exists
    if [ -L "$WS/$ws_filename" ]; then
        echo "🗑️ Removing symlink: $ws_filename"
        rm "$WS/$ws_filename"
    fi
    
    # Copy file back from vault
    if [ -f "$VAULT/$vault_subpath" ]; then
        echo "📄 Copying $vault_subpath -> $ws_filename"
        cp "$VAULT/$vault_subpath" "$WS/$ws_filename"
    else
        echo "⚠️ Warning: Source $vault_subpath not found in vault."
    fi
}

restore_file "01_soul/SOUL.md" "SOUL.md"
restore_file "01_soul/IDENTITY.md" "IDENTITY.md"
restore_file "01_soul/PHILOSOPHY.md" "PHILOSOPHY.md"
restore_file "00_memories/MEMORY.md" "MEMORY.md"
restore_file "02_agent/AGENTS.md" "AGENTS.md"
restore_file "02_agent/BOOT.md" "BOOT.md"
restore_file "02_agent/BOOTSTRAP.md" "BOOTSTRAP.md"

echo "✅ Restoration complete. Workspace files are now physical clones."

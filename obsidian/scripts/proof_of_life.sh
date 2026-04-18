#!/bin/bash
VAULT="/Users/igorsilva/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/openclaw"

echo "🔬 BEGINNING PHYSICAL PROOF-OF-LIFE AUTO-TEST..."

folders=("00_memories" "01_soul" "02_agent" "03_skills" "04_memory_graph")

for f in "${folders[@]}"; do
    path="$VAULT/$f"
    if [ -d "$path" ]; then
        echo "✅ Folder Found: $f"
        echo "v8.0 Physics Verified: $(date)" > "$path/PROOF_OF_LIFE.md"
        echo "📝 Written proof to $f/PROOF_OF_LIFE.md"
    else
        echo "❌ Folder MISSING: $f"
    fi
done

echo "📖 READING BACK PROOFS..."
ls -R "$VAULT" | grep PROOF_OF_LIFE

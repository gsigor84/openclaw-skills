#!/bin/bash

# --- Skill Catalog Sync (v11.0) ---
REGISTRY="/Users/igorsilva/.openclaw/skills"
VAULT_SKILLS="/Users/igorsilva/Library/Mobile Documents/iCloud~md~obsidian/Documents/openclaw/03_skills"
CATALOG_FILE="$VAULT_SKILLS/00_CATALOG.md"

mkdir -p "$VAULT_SKILLS"

echo "# 📚 OpenClaw Skill Catalog" > "$CATALOG_FILE"
echo "Generated on: $(date)" >> "$CATALOG_FILE"
echo "Architecture: v11.0 (Manual of Me)" >> "$CATALOG_FILE"
echo "" >> "$CATALOG_FILE"
echo "| Skill | Description | Documentation |" >> "$CATALOG_FILE"
echo "|-------|-------------|---------------|" >> "$CATALOG_FILE"

# Iterate through every folder in the registry
for skill_dir in "$REGISTRY"/*; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        skill_md="$skill_dir/SKILL.md"
        
        if [ -f "$skill_md" ]; then
            # 1. Extract Description (Quick & Dirty grep)
            description=$(grep "description:" "$skill_md" | head -n 1 | cut -d'"' -f2)
            if [ -z "$description" ]; then description="N/A"; fi
            
            # 2. Add to Catalog Index
            echo "| **$skill_name** | $description | [[$skill_name]] |" >> "$CATALOG_FILE"
            
            # 3. Create Note for Individual Skill
            target_note="$VAULT_SKILLS/$skill_name.md"
            
            # Add v11.0 Headers
            echo "---" > "$target_note"
            echo "name: $skill_name" >> "$target_note"
            echo "source_path: $skill_dir" >> "$target_note"
            echo "sync_date: $(date -Iseconds)" >> "$target_note"
            echo "status: active" >> "$target_note"
            echo "---" >> "$target_note"
            echo "" >> "$target_note"
            
            # Append original documentation
            cat "$skill_md" >> "$target_note"
            
            echo "✅ Synced: $skill_name"
        fi
    fi
done

echo "" >> "$CATALOG_FILE"
echo "---" >> "$CATALOG_FILE"
echo "Total Skills Synced: $(find "$VAULT_SKILLS" -name "*.md" | wc -l)" >> "$CATALOG_FILE"

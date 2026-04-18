---
name: skill-forge
description: "Meta-Orchestrator for creating perfectly architected OpenClaw skills following the V3 infrastructure."
---

# skill-forge (v1.0)

## Purpose
The **Skill Forge** automates the creation of new OpenClaw skills. It ensures that every skill is born with the correct directory structure, metadata, and handler boilerplate, reducing developer friction and enforcing the V3 standard.

## Triggers
- "forge [niche]"
- "create skill [niche]"
- "scaffold a new skill for [niche]"

## Inputs
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `niche` | Yes | | The name of the niche/skill to create (e.g., "mcp-cortex") |
| `goal` | No | | A brief description of what the skill should accomplish |
| `creative`| No | false | Enable idea-generator-v2 for non-obvious angles |

## Standard Structure
Every skill forged will include:
1. **SKILL.md**: Frontmatter + Instructions.
2. **handler.ts**: Node.js entry point.
3. **references/**: Research corpus and templates.
4. **scripts/**: Support scripts (Python/Shell).
5. **assets/**: Media and static files.

## Procedure
1. **Directory Creation**: Scaffold the 5-item root.
2. **Research Grounding**: (Optional) Ingest topic data via NotebookLM/Perplexity.
3. **Instructional Build**: Generate `SKILL.md` using the research corpus.
4. **Boilerplate Injection**: Write a functional `handler.ts` based on the global template.
5. **Registration**: Symlink the skill into the live OpenClaw system.

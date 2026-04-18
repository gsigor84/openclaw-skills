# Design Patterns: Structural Hole Brokerage

## Pattern 1: The Library Broker
Identify "Thematic Islands" in the entire skill library. If there are many skills for [Domain A] and [Domain B] but they don't interact, design a "Bridge" skill.
- **Example**: Many Code skills + many Video skills -> Build "Code-to-Video Explainer" skill.

## Pattern 2: The Procedural Bridge
Identify "Disconnected Procedures" within a single `SKILL.md`. If Step 2 does not logically produce the input for Step 3, identify the "Structural Hole" and add a bridging step.

## Pattern 3: Non-Redundancy Check
Ensure every new skill adds a non-redundant capability. If a skill already exists in the same conceptual cluster, the Architect should suggest a "Boundary Critique" to force differentiation.

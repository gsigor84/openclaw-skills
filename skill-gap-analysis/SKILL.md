---
name: skill-gap-analysis
description: "The InfraNodus core. Performs structural hole analysis on any text corpus to identify disconnected clusters and the thematic bridges between them."
---

# skill-gap-analysis

## Trigger
`/gap-audit <text_or_file>`

## Use
Use this skill to identify structural holes in a project, a research corpus, or a skill library. It build a co-occurrence graph of tokens and detects clusters that are not talking to each other.

**The analyst will help you:**
- **Find Brokerage Opportunities**: Identify concepts that can bridge disconnected domains.
- **Audit Redundancy**: See where your research is looping in the same cluster.
- **Strategic Direction**: Provides the "Missing Link" query for your next search mission.

---

## Guiding Principles

### Internal Quality Check (Anti-Drift)

**Phase Check**: During the **Audit Lobby**, be investigative. During the **Analysis Phase**, be technical and data-driven.

Before outputting results, verify:
- Have at least 3 communities Been identified?
- Do the bridging questions refer to nodes from *different* communities?
- Is the `research-log.md` updated with the latest community count?

---

## Global Session State (Memory)

The analyst maintains and reads the **Research Log** at:
`/Users/igorsilva/.openclaw/workspace/state/research-log.md`

**Reading Strategy:**
At the start of an audit, check the log to see previous "Thematic Islands" and identified gaps for this project.

**Writing Strategy:**
After the audit, record:
- `[Audit Date] | [Community Count] | [GEXF Export Path] | [Primary Gap Focus]`

---

## Procedure

### The Audit Lobby (The Lobby)

If the user runs `/skill-gap-audit` (or with a directory):
1. **Greet and Inspect**: "Welcome to the Strategic Gap Analyst. I am preparing a modularity audit of your corpus."
2. **Corpus Health Check**: Scan the directory. Report: "Found [N] research documents. This size is ideal for [Detection Mode]."
3. **Set the Stage**: Explain the goal: "I'll be looking for isolated Thematic Islands and generating the questions needed to unify your research."

### The Detection Phase (Work)

**1. Execution**
- Run the python analyzer:
  `/opt/anaconda3/bin/python3 /Users/igorsilva/clawd/tools/skill_gap_analysis.py --input-dir [input] --output-dir [output]`
- The analyzer builds a sliding-window co-occurrence graph (window=5) and detects communities.

**2. Synthesis**
For each identified **Structural Hole**:
1. Identify **Node A** and **Node B** (Disconnected high-betweenness concepts).
2. Report the **Gap Score** (Structural hole density).
3. Present the **Bridging Questions** to force synthesis between these domains.

**3. Log Update**
- Synchronize with `research-log.md` with updated community counts and primary gap focus.

---

## Inputs
- **corpus-dir** (required): the folder containing your research text files or pass1 responses.
- **min-degree** (optional): minimum connectivity for a node to be included in the graph.

## Outputs
- **Structural Hole Map**: A report of disconnected high-focus pairs.
- **Bridging Questions**: High-fidelity questions to close structural holes.
- **Audit Bundle**: Path to `skill-gap-graph.gexf` and `gap-meta.json`.

---

## Failure modes

### Hard blockers
- Directory Missing → "ERROR: corpus_not_found. Please provide a valid absolute path to your research directory."
- Sparse Graph → "The corpus is too small to detect communities. Please add more source material before auditing gaps."

### Common failure patterns

| Pattern | Signal | Fix |
|---|---|---|
| Modularity Noise | 10+ small communities | Increase `--min-degree` to filter out noise and focus on core themes. |
| Fragmented State | Logs don't match the graph | Rerun the audit from scratch and force a log rewrite. |
| Subjective Gaps | Bridging questions feeling 'random' | Check cross-community node overlap and ensure questions target the highest-degree nodes. |

---

## Acceptance tests

1. `/skill-gap-audit` (no dir)
   → Agent starts the Lobby and asks for the corpus path.
   → Expected: The output explains the "Thematic Island" logic.

2. `/skill-gap-audit /Users/igorsilva/research-corpus/`
   → Agent runs the Python audit tool.
   → Expected: The output contains "Bridging Questions" and a list of communities.

3. Structural validation:
```bash
/opt/anaconda3/bin/python3 /Users/igorsilva/.openclaw/skills/master-architect/scripts/validate_skillmd.py \
  /Users/igorsilva/.openclaw/skills/skill-gap-analysis/SKILL.md
```
   → Expected: `PASS`.

4. Negative Case — **Invalid** Path:
   → If user provides a non-existent path.
   → Expected: The output returns the `corpus_not_found` **error** and stops.

5. Negative Case — **Fails** on Empty Dir:
   → If dir has no text files.
   → Expected: Output **fails** or asks for source material.

---

## Toolset
- `read` (to check research-log.md)
- `write` (to update log/audits)
- `exec` (to run skill_gap_analysis.py)
- `/opt/anaconda3/bin/python3 /Users/igorsilva/clawd/tools/skill_gap_analysis.py`

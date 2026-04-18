---
name: trash-miner
description: "V3.0 Autonomous Niche Research Engine. Mines Reddit RSS for pain points and detecting structural gaps using graph-based intelligence."
---

# trash-miner (v3.0)

![Trash Miner Logo](file:///Users/igorsilva/clawd/skills/trash-miner/assets/logo_v2.png)

## Purpose
Mine Reddit RSS feeds for pain points and **Autonomous Structural Gaps** in any niche. Uses a modular V3 architecture with dedicated health checks and reference-grounded intelligence.

**Triggers:**
- `/trash-miner [niche]`
- `/trash-miner --niche [niche]`
- `/trash-miner --source [source] --niche [niche]`
- "research [niche]"
- "mine [niche]"
- "run structural intelligence on [niche]"

## Use
Mine Reddit RSS feeds for pain points and **Autonomous Structural Gaps** in any niche. This skill identifies developer friction and product opportunities by detecting "Bridges" in conversational data.

## Inputs
| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| niche | yes | — | Topic to research e.g. "mcp servers" |
| niche_type | no | saas | One of: saas, ecommerce, services, learning |
| subs | no | auto-discovered | Subreddits to target |

## Workflow

### Phase 0 — Environmental Integrity Check
```bash
/opt/anaconda3/bin/python3 scripts/health_check.py
```
- **Deterministic Check**: Verifies `spaCy` (en_core_web_sm) and `Ollama` health.
- **Rules**: If Phase 0 fails, HALT and prioritize environment fixes.

### Phase 1 — Grounded Intelligence Pass
1. **Reference Loading**: Load core methodologies from `references/structural_intelligence_theory.md`.
2. **Seed Generation**:
   ```bash
   cd /Users/igorsilva/PycharmProjects/trash_miner
   /opt/anaconda3/bin/python3 seed_factory.py --source {SOURCE} --topic "{niche}"
   ```

### Phase 2 — Targeted Harvesting
Scout and mine Reddit threads.
```bash
/opt/anaconda3/bin/python3 rss_miner.py --mode fetch --subs {subs} --t month
```

### Phase 2.5 — Autonomous Validation Check
```bash
/opt/anaconda3/bin/python3 scripts/subreddit_validator.py
```
- **Deterministic Check**: Verifies post volume and distribution across subreddits.
- **Rules**: If Phase 2.5 fails (fewer than 5 signals found), the skill will HALT to prevent wasted intelligence passes.

### Phase 3 — Structural Intelligence Pass
```bash
cd /Users/igorsilva/PycharmProjects/trash_miner/openclaw_miner
/opt/anaconda3/bin/python3 run_pipeline.py --input ../data/reddit_threads.jsonl --niche "{niche}"
```
- **Analysis**: Normalization, Zero-Shot Classification, and Graph-Based Bridge Detection on the actual harvested data.

### Phase 4 — Insight Relay & Reporting
1. **Synthesize Report**:
   ```bash
   cd /Users/igorsilva/PycharmProjects/trash_miner
   /opt/anaconda3/bin/python3 niche_broker_report.py
   ```
2. **Relay to Store**:
   ```bash
   /opt/anaconda3/bin/python3 scripts/report_relay.py
   ```
- **Output**: Strategic report saved to `~/clawd/data/trash_miner/{niche}_{YYYYMMDD}.md`.

## Outputs
| Asset | Location |
|-------|----------|
| Raw Data | `/Users/igorsilva/PycharmProjects/trash_miner/data/reddit_threads.jsonl` |
| Normalized Signals | `/Users/igorsilva/PycharmProjects/trash_miner/openclaw_miner/data/normalized/` |
| Strategic Report | `~/clawd/data/trash_miner/{niche}_{YYYYMMDD}.md` |

## Failure modes
| Failure | Detection | Fix |
|---|---|---|
| Environment Fail | Phase 0 Halt | Run `scripts/health_check.py` and fix `spaCy` or `Ollama` |
| Low Signal Volume | Phase 2.5 Halt | Broaden the search topic or add more `subs` to `config/vars` |
| API Timeout | Phase 3 Warning | Pipeline switches to local HuggingFace quantized fallback |

## Boundary Rules
- NEVER skip the Structural Intelligence pass.
- ALWAYS reference `references/` when explaining "Bridges" or "Gaps" to the user.
- NEVER reuse report filenames across separate research runs.

## Skill Resources
- **Theory**: [Structural Intelligence Theory](file:///Users/igorsilva/clawd/skills/trash-miner/references/structural_intelligence_theory.md)
- **Foundation**: [InfraNodus Transcript](file:///Users/igorsilva/clawd/skills/trash-miner/references/transcript_foundation.txt)

## Acceptance tests
1. **Niche Intelligence Pass**: Run `/trash-miner --niche "mcp servers"` — expected: Mission Complete with a report link in `~/clawd/data/trash_miner/`.
2. **Natural Language Research**: Type `mine "sustainability in automotive"` — expected: Successful research pass triggered by the intent parser.
3. **Negative case — missing niche**: Run `/trash-miner` with no arguments — expected: Error message "Please specify a niche" and usage instructions.
4. **Structural Validation**: Run `/opt/anaconda3/bin/python3 ~/clawd/skills/skillmd-builder-agent/scripts/validate_skillmd.py ~/clawd/skills/trash-miner/SKILL.md` — expected: `PASS`.
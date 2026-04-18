---
name: blogwatcher
description: "V1 Production Editorial Assistant. Synthesizes updates from 27+ blogs into a ranked, focus-aligned briefing using semantic proximity and structural deduplication."
---

# blogwatcher (V1)

## Trigger
`/blogwatcher [scan|list|read]`

## Use

Use this skill to receive a high-fidelity intelligence briefing on the latest tech and AI news. The system filters for **recency (72h)**, aligns with your **`research-log.md`**, and synthesizes the top 3-5 story clusters into a single cohesive report.

**The assistant will provide:**
1.  **Curated Briefing**: Top 3-5 insights that matter *now* relative to your current research focus.
2.  **Thematic Synthesis**: Groups related stories from different blogs into a single structural point.
3.  **Source Affinity**: Automatically learns which sources provide the most value over time.

---

## Procedure

### 1. The Editorial Briefing
If you run `/blogwatcher` or `/blogwatcher list`:
1. The engine executes `/Users/igorsilva/clawd/tools/blogwatcher_engine.py`.
2. It ingests unread articles from your 27+ tracked blogs.
3. It performs **Semantic Alignment** against the latest entries in `research-log.md`.
4. It presents a ranked briefing with "What it is" and "Why it matters".

### 2. Reading and Feedback
When you ask to "read [ID]", the system:
1. Opens the article content.
2. Increases the **Affinity Score** for that blog.
3. Updates the usage statistics to prioritize this source in tomorrow's briefing.

---

## Toolset
- `/Users/igorsilva/go/bin/blogwatcher`: Core feed manager (Ingestion).
- `/Users/igorsilva/clawd/tools/blogwatcher_engine.py`: The V1 Intelligence Engine (Ranking/Grouping/Synthesis).
- `/Users/igorsilva/.openclaw/workspace/state/blogwatcher_affinity.json`: The persistence layer for source preference.

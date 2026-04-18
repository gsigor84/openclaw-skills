# Research Tool API Reference

## web_research.py (V3.1 — Perplexity Sonar)
The core engine for fetching and synthesizing web data using the Perplexity Sonar models.

- **Path**: `/Users/igorsilva/clawd/tools/web_research.py`
- **Model**: `sonar` (Online LLM with real-time web access)
- **Endpoint**: `https://api.perplexity.ai/chat/completions`
- **Arguments**:
  - `query`: The research topic or target domain.
  - `mode`: `editorial` (default) or `technical`.
  - `broker_off`: (Optional) Disable the second-pass brokerage search.

## skill_gap_analysis.py (V3.1)
The structural auditor for identifying conceptual gaps.

- **Path**: `/Users/igorsilva/clawd/tools/skill_gap_analysis.py`
- **Arguments**:
  - `--input-dir`: Directory containing `.response.txt` files.
  - `--output-dir`: Path for graph and report exports.
  - `--min-degree`: Connectivity filter (default: 3).

## Probing Patterns (Technical Track)
Common paths tested during Technical Discovery:
- `/rss`
- `/feed`
- `/api/v1`
- `/index.xml`
- `/sitemap.xml`

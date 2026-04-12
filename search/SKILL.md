---
name: search
description: "High-Fidelity Research & Discovery Assistant. Dual-track logic for Editorial Synthesis and Technical Endpoint Discovery (RSS/APIs). Enforces direct verification to bypass search engine noise."
---

# search

## Trigger
`/search <query>`

## Use

Use this skill to research complex topics or find specific technical infrastructure (RSS feeds, API endpoints, working URLs). The assistant operates on two distinct tracks:
1.  **Editorial Track**: Synthesizes facts, news, and history into grounded reports with citations.
2.  **Technical Discovery Track**: Specifically filters out search engine noise to find machine-readable endpoints using direct HTTP probes and pattern matching.

**The assistant will help you:**
- **Find Living Endpoints**: Verifies that reported URLs actually exist (200 OK) and match the expected content type.
- **Bypass Noise**: Detects when search results are dominated by forums or spam and pivots to direct structural probing.
- **Synthesize Research**: Maintains a persistent record of all findings in the research log.

---

## Guiding Principles

**1. Synthetic Reasoning (Perplexity Mode).**
Prioritize the model's judgment over raw search relevance. DuckDuckGo-style keyword matching often returns "noise" (spam, forums). You MUST use Perplexity's ability to reason about the query to distinguish between a "page about a topic" and "the actual target endpoint."

**2. The Verification Trap.**
Never report a technical URL (RSS, API, Endpoint) based on search relevance alone. You MUST verify its existence using a direct HTTP HEAD request (curl -I) before presenting it as "Found."

**3. Pattern-First Discovery.**
If searching for a feed or endpoint, do not rely on the search engine to find the exact URL. Use search to find the *root domain*, then apply a library of common infrastructure patterns (e.g., `/feed/`, `/rss`, `/index.xml`).

**4. Triangulate & Ground.**
For editorial tasks, check multiple sources to verify claims. Cite every fact using bracketed numbers [1].

**5. Silence Corporate Noise.**
Specifically ignore forum threads, scraper sites, and SEO-spam. Favor official documentation, verified feeds, and authoritative sources.

---

### Internal Quality Check (Anti-Drift)

**Phase Check**: During the **Technical Discovery Phase**, be structural and binary (Does it exist? What is the status code?). During the **Synthesis Phase**, be nuanced and objective.

Before outputting a technical URL:
- Run `curl -I` on the candidate.
- Does it return `200 OK`?
- Does it match the expected pattern?
- If no, keep searching or admit the failure.

---

## Global Session State (Memory)

Maintain the **Research Log** at:
`/Users/igorsilva/.openclaw/workspace/state/research-log.md`

**Reading Strategy:**
At the start of any mission, read the log to see previous related investigations and avoid redundant searches.

**Writing Strategy:**
After providing a report, append a summary:
```markdown
## Research Date: [YYYY-MM-DD]
- **Topic**: [Topic Name]
- **Type**: [Editorial | Technical Discovery]
- **Verified Endpoints**: [List of URLs with status codes]
- **Key Findings**: [Synthesized bullets]
```

---

## Procedure

### The Lobby (Mission Entry)

If the user runs `/search` without a query:
1. **Greet and Refine**: "Welcome to the Research Lab. Are we investigating a topic or hunting for technical endpoints?"
2. **Context Check**: Read the latest log entries.

### The Investigation Phase

**Mode A: Technical Discovery** (Triggered by: RSS, feed, API, endpoint, JSON, XML)
1. **Find Root**: Use `web_research.py` to identify the most likely root domain for the subject.
2. **Structural Probe**: Test common patterns using `curl -I` or `read`:
   - `[root]/feed/`
   - `[root]/rss/`
   - `[root]/news/feed/`
   - `[root]/index.xml`
3. **Verify**: Only report URLs that return a `200 OK` status and the correct content-type.
4. **Report**: List the verified endpoints with a 💡 tip on how to use them.

**Mode B: Editorial Synthesis** (Default mode)
1. **Execute Search**: Run `web_research.py`.
2. **Triangulate**: Cross-reference at least 3 high-quality sources.
3. **Draft Report**:
   - **Current Findings**: Grounded narrative with citations [1].
   - **Conflicting Data**: (If any).
   - **Sources**: List of URLs.

---

## Inputs
- **query** (required): the topic, site, or endpoint to investigate.
- **mode** (optional): force `editorial` or `technical` logic.

## Outputs
- **Verified Link(s)**: (Technical) URLs that have been confirmed with a 200 OK status.
- **Synthesized Report**: (Editorial) Grounded research with bracketed citations.
- **Log Entry**: Updated entry in `research-log.md`.

---

## Failure modes

### Hard blockers
- API Restricted → "Search engine access is currently restricted. I will pivot to direct pattern-probing on the target domain."
- Script Missing → "web_research.py not found. Please verify the system path at /Users/igorsilva/clawd/tools/."

### Common failure patterns

| Pattern | Signal | Fix |
|---|---|---|
| Reporting Noise | URL points to a forum or reddit thread | Discard and perform direct `curl` probe on root. |
| Dead Endpoints | Reported URL returns 404/403 | Rerun verification on a different pattern. |
| Uncited Claims | Fact without a [1] tag | Rerun generation with mandatory citations. |

---

## Acceptance tests

1. `/search`
   → Agent welcomes user and clarifies if the mission is editorial or technical.
   → Expected: The output refers to the "Technical Discovery" track.

2. `/search [Site] RSS feed`
   → Agent identifies the root domain and tests patterns.
   → Expected: The output contains a **Verified Endpoint** with a status code (e.g., 200 OK).

3. `/search What is the current status of Project X?`
   → Agent performs editorial research.
   → Expected: The output contains a synthesized report with bracketed citations [1].

4. Negative Case — Dead URL:
   → If search finds a URL that returns a 404.
   → Expected: The output must NOT report that URL as the answer. It must admit the gap or try another pattern.

5. Negative Case — Missing Anchor:
   → If search returns only spam or forum noise.
   → Expected: Agent pauses and asks for a direct root domain to start a structural probe.

---

## Toolset
- `/Users/igorsilva/clawd/tools/web_research.py`: Core search execution script.
- `exec: curl -I`: Mandatory for endpoint verification in Technical Discovery mode.
- `read` / `web_fetch`: To inspect candidate endpoint headers.

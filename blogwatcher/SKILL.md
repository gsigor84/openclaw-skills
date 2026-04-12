---
name: blogwatcher
description: "Editorial Assistant. Tracks and synthesizes updates from 27+ tech and AI blogs. Filters for relevance based on your research history and groups unread articles into thematic clusters."
---

# blogwatcher

## Trigger
`/blogwatcher [scan|list|read|add|remove]`

## Use

Use this skill to stay informed across your personal feed of tech, AI, and solopreneurship blogs. Instead of a raw list of articles, the assistant act as an editor: scanning updates, identifying high-relevance "Priority" matches based on your recent work, and grouping news into thematic clusters.

**The assistant will help you:**
- **Manage Information Overload**: With 500+ unread articles, it prioritizes what matters now.
- **Thematic Scanning**: Group articles by subject (e.g., "3 new pieces on Claude-code") so you can skim faster.
- **Contextual Relevance**: Automatically tags articles matching your `research-log.md` items as **[PRIORITY]**.

**The assistant will NOT:**
- **List everything at once**: It provides summaries and clusters to aid scanning.
- **Mark read without permission**: You decide when to clear your feed.

---

## Guiding Principles

**1. Priority on Relevance.**
Always check `/Users/igorsilva/.openclaw/workspace/state/research-log.md` before listing articles. If a title or blog matches a current research focus, explicitly label it **[PRIORITY]**.

**2. Thematic Clustering.**
Do not present a long list of chronologically sorted titles. Group articles by theme (e.g., "AI Research," "Solopreneurship," "Tool Updates").

**3. Summarize, Don't Dump.**
For unread articles, provide a 1-sentence "Why this matters" teaser based on the title and blog reputation, rather than just the URL.

**4. Editorial Integrity.**
Maintain a perspective: "Since you've been focused on [X], these 2 articles from Lilian Weng are your high-value reads for today."

---

### Anti-drift anchor (internal)

**Phase Check**: During the **Lobby Phase**, be dashboard-oriented and invitational. During the **Editorial Phase**, be synthesizing and analytical.

After every scanning turn, check:
- Am I grouping articles into themes?
- Did I correctly identify **[PRIORITY]** matches from the research log?
- Am I providing exactly one clear editorial recommendation?

If no: correct in the next turn.

---

## Global Session State (Memory)

This skill integrates with:
- `/Users/igorsilva/.openclaw/workspace/state/research-log.md`: To set priorities.
- `/Users/igorsilva/.openclaw/workspace/state/tutor-log.md`: To align with current communication learning goals.

---

## Procedure

### The Lobby (Editorial Dashboard)

If the user runs `/blogwatcher` (or with `scan`):
1. **Greet and Status**: Provide the **Editorial Dashboard**:
   - **Feed Volume**: (Total unread count from `blogwatcher articles | wc -l`)
   - **Freshness**: (How many new today from `blogwatcher scan`)
   - **Priority Matches**: (How many match current research/tutor themes).
2. **Editorial Recommendation**: "You have 500+ unread, but **3 priority pieces** match your current research into [Theme]. Shall we start with those, or do a thematic scan of the whole feed?"

### The Scanning Phase

**1. Thematic Grouping**
When listing articles:
1. Run `exec: /Users/igorsilva/go/bin/blogwatcher articles`.
2. Analyze the titles.
3. Present them in clusters (e.g., **"AI Models & Research"**, **"Engineering Practices"**, **"Market Intelligence"**).
4. For each cluster, list: `[N] Title (Blog Name)`.

**2. Deep Dive (Read)**
When the user asks to "read 123":
1. Run `exec: /Users/igorsilva/go/bin/blogwatcher read 123`.
2. Follow the Link to fetch content (if browser tool available) and provide a 3-bullet summary.

**3. Feed Management**
Handle `add`, `remove`, and `blogs` (list) using the `blogwatcher` CLI directly. Preserve the warm tone: *"I've added 'New Blog' to your radar. It’s now being tracked alongside your other 27 sources."*

---

## Inputs
- **command**: `scan`, `list`, `read`, `add`, `remove`, `blogs`.
- **query**: (optional) search for specific keywords in titles.

## Outputs
- **Editorial Dashboard**: Quick status of feed volume and priority matches.
- **Thematic Cluster Report**: Grouped articles with relevance tagging.
- **Article Summary**: (If reading) Concise 3-bullet breakdown of the content.

---

## Failure modes

### Hard blockers
- Binary missing → "Blogwatcher not found at /Users/igorsilva/go/bin/blogwatcher. Please verify installation."
- Feed unreachable → "Unable to reach [Blog URL]. I'll retry in the next scheduled scan."

### Common failure patterns

| Pattern | Signal | Fix |
|---|---|---|
| Information Overload | List > 10 articles without grouping | Pivot immediately to thematic clustering. |
| Relevance Blindness | Missing a match for a research-log item | Rerun scan with "PRIORITY" keyword check. |
| Stale Scan | No articles since '2025' | Run `blogwatcher scan` and report new findings. |

---

## Acceptance tests

1. `/blogwatcher` (no command)
   → Agent starts the Lobby and displays the Editorial Dashboard.
   → Expected: The output contains words like "unread," "priority," and "recommendation."

2. `/blogwatcher scan`
   → Agent performs a scan and checks for priority matches.
   → Expected: The output contains a list of new articles with at least one [PRIORITY] tag if a match exists.

3. `/blogwatcher list`
   → Agent lists articles in thematic clusters.
   → Expected: The output contains bold thematic headings (e.g., **AI Research**).

4. Negative Case — Binary Missing:
   → If `blogwatcher` is not found at the specified path.
   → Expected: The output returns a "not found" error message and stops.

5. Negative Case — No Priority:
   → If no articles match the research log.
   → Expected: The output returns a "no high-relevance matches today" message and continues with a general scan.

---

## Toolset
- /Users/igorsilva/go/bin/blogwatcher: Core feed management binary.

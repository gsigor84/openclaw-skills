---
name: morning-briefing
description: "Daily Command Center. Synthesizes system health, news, GitHub updates, and personal coaching continuity for a unified start-of-day mission."
---

# morning-briefing

## Trigger
`/briefing [config]`

## Use

Use this skill at the start of your day to get a unified overview of your digital world. The briefing connects the dots between your system's health, your ongoing learning, and your research missions.

**The briefing includes:**
- **System Health**: Overnight self-healing events and current gateway status.
- **Unfinished Business**: Reminders of your last coaching "Action Plan" and research focus.
- **Intel**: New articles from `blogwatcher` and repo updates from `github-monitor`.

**The system will NOT:**
- **Overwhelm**: It synthesizes information into high-level summaries rather than raw data dumps.
- **Be robotic**: It uses a warm, mission-oriented tone to help you set the day's intent.

---

## Guiding Principles

**1. Context is King.**
Do not just list news. Connect it to what you know about the user's current research interests or learning goals.

**2. Focus on "Unfinished Business."**
The most valuable part of the briefing is the bridge between yesterday and today. Explicitly mention the next step for a pending Action Plan or Research Mission.

**3. Synthesize the "Noise."**
If 10 articles are found, pick the 3 most relevant based on the user's research log. If 5 GitHub releases happen, highlight the one most likely to impact the user's workflow.

**4. Priority on System Integrity.**
If the self-healing system detected a major error overnight, that must be the first item in the briefing.

**5. Warm but Professional Tone.**
Open with a single warm greeting line, then proceed immediately to the briefing. No back-and-forth before content is delivered.

---

## Global Session State (Memory)

This skill reads from the following state files in `/Users/igorsilva/.openclaw/workspace/state/`:
- `self-healing-history.md`: For overnight system events.
- `listening-well-log.md`: For the most recent CBT Action Plan.
- `tutor-log.md`: For the last communication exercise.
- `research-log.md`: For the current research focus and monitored repos.

---

## Procedure

### Step 1 — Greet and proceed (no round-trip)

Open with a single warm line: *"Good morning, Igor. Here's your mission briefing."*

Then immediately execute all sections below in sequence. Do not ask the user what to start with. Do not wait for confirmation.

---

### Step 2 — System Health Intelligence

- Read `/Users/igorsilva/.openclaw/workspace/state/self-healing-history.md`.
- Summarize any overnight recoveries or errors.
- Check Gateway status at `http://localhost:18789/` and Tandem status.
- If Gateway is DOWN: surface this as a **CRITICAL** alert and move it to the top of the briefing regardless of order.

---

### Step 3 — Personal Continuity (Unfinished Business)

- Read `listening-well-log.md` and `tutor-log.md`.
- Highlight the last Action Plan: *"Reminder: You planned to [Action] today."*
- Read `research-log.md`: *"We were investigating [Topic] yesterday."*
- If state files are missing: skip this section silently and continue.

---

### Step 4 — External Intel (News & Code)

**Articles:**
- Run `exec: /usr/bin/python3 /Users/igorsilva/clawd/tools/blogwatcher_engine.py`

### Article Filtering & Ranking

**Step 1 — Date filter**
- Discard any article older than 72 hours.
- If zero articles remain, report: `No new articles in the last 72 hours.` and skip the rest of the article section.

**Step 2 — Extract active research topics**
- Read `research-log.md`.
- Extract the current active topic(s) as concise keywords, preferably from the current query, title, or key nouns.
- If `research-log.md` is missing or has no active topic, fall back to static keywords:
  `agents, MCP, tool use, autonomous workflows, skills, OpenClaw, model releases, developer tooling`

**Step 3 — Score each remaining article (0–5)**
- `+2` if the article title matches active research topic(s) from `research-log.md`
- `+1` if the article title matches fallback static keywords
- `+1` if published within the last 24 hours
- `+1` if the source blog appears frequently in the recent candidate set
- Tiebreaker at any equal score: newer article wins

**Step 4 — Cut to top 3**
- Keep only the 3 highest-scoring articles.
- Discard the rest.

**GitHub updates:**
- Read `research-log.md` for the current `monitored_repos` list.
- If `monitored_repos` is defined, use that list.
- If not defined, fall back to `anthropics/claude-code,modelcontextprotocol/servers`.
- Run `exec: /usr/bin/python3 /Users/igorsilva/clawd/skills/github-monitor/scripts/github-monitor.py --repos [resolved_repos] --output-format briefing`

**Synthesis:**
- For each selected article, write 1–2 sentences covering what it is about and why it matters relative to the current research focus.
- Do not raw-dump titles or URLs without explanation.
- Pick the 2–3 most relevant items across both sources.
- Explain *why* each item matters relative to current research focus.

---

### Step 5 — End-of-briefing assertions (mandatory before closing)

Before completing the response, confirm all of the following internally. If any check fails, correct it inline before finishing:

- [ ] Self-healing log was checked and reported (or explicitly noted as missing).
- [ ] Last Action Plan from listening-well or tutor log was surfaced (or section skipped with reason).
- [ ] Research log was read and current focus was acknowledged.
- [ ] Blog and GitHub intel was synthesised — not raw-dumped.
- [ ] Tone was warm on open, precise through the body.

Do not report this checklist to the user. Use it as a silent quality gate.

---

## Inputs

- **config** (optional):
  - `full` — all sections (default when no config given)
  - `intel` — News and GitHub only
  - `health` — System status only
- **`--send-whatsapp`** (optional flag): After delivering the briefing, send a concise summary to WhatsApp using the native message tool with `channel=whatsapp` and `target=+447533464436`. The WhatsApp version should be 3–5 bullet points max, not the full briefing.

---

## Failure modes

| Pattern | Signal | Fix |
|---|---|---|
| Script missing | `blogwatcher` or `github-monitor` fails | Report the missing dependency and provide the rest of the briefing. |
| Log gaps | State files don't exist yet | Skip the continuity section and continue with news/health. |
| Gateway down | `http://localhost:18789/` fails | Surface as CRITICAL recovery alert at the top of the briefing. |
| No `monitored_repos` in research-log | Field absent or file missing | Fall back to default repo list silently. |

---

## Acceptance tests

1. `/briefing`
   → Agent opens with a single warm greeting line and immediately delivers the full briefing — no check-in question, no waiting for confirmation.
   → Expected: Output contains "System Health," "Unfinished Business," and "Intel" sections in one pass.

2. `/briefing full`
   → Same as above. No Lobby phase.
   → Expected: Identical structure to bare `/briefing`.

3. `/briefing intel`
   → Agent focuses on Blog and GitHub updates only.
   → Expected: Output leads with articles and GitHub updates. No system health or continuity sections.

4. `/briefing health`
   → Agent focuses on system status only.
   → Expected: Output covers gateway, Tandem, and self-healing log. No intel or continuity.

5. `/briefing --send-whatsapp`
   → Agent delivers full briefing in terminal and sends a 3–5 bullet summary to WhatsApp.
   → Expected: WhatsApp message dispatched via the native message tool. Terminal output is unchanged.

6. Negative — Missing logs:
   → State files in `workspace/state/` are absent.
   → Expected: Continuity section is skipped silently. Briefing continues with health and intel.

7. Negative — Script failure:
   → `blogwatcher` returns non-zero exit code.
   → Expected: Failure is reported inline. Rest of briefing continues normally.

8. Negative — No `monitored_repos` in research-log:
   → Field is absent or file is missing.
   → Expected: Falls back to default repo list silently. No error surfaced to user.

---

## Toolset
- `/Users/igorsilva/go/bin/blogwatcher`
- `/usr/bin/python3`
- `/Users/igorsilva/clawd/skills/github-monitor/scripts/github-monitor.py`
- `message` tool (for `--send-whatsapp`)
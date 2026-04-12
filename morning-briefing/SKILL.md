---
name: morning-briefing
description: "Daily Command Center. Synthesizes system health, news, GitHub updates, and personal coaching continuity for a unified start-of-day mission."
---

# morning-briefing

## Trigger
`/briefing [config]`

## Use

Use this skill at the start of your day to get a unified overview of your digital world. The briefing provides more than just news; it connects the dots between your system's health, your ongoing learning, and your research missions.

**The briefing includes:**
- **System Health**: Overnight self-healing events and current gateway status.
- **Unfinished Business**: Reminders of your last coaching "Action Plan" and research focus.
- **Intel intelligence**: New articles from `blogwatcher` and repo updates from `github-monitor`.

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
If 10 articles are found, pick the 3 most relevant based on the user's research log. If 5 github releases happen, highlight the one most likely to impact the user's workflow.

**4. Priority on System Integrity.**
If the self-healing system detected a major error overnight, that must be the first item in the briefing.

**5. Warm but Professional Tone.**
A "Good Morning" should feel human, but the briefing itself should be efficient and clear.

---

### Anti-drift anchor (internal)

**Phase Check**: During the **Lobby Phase**, be warm and invitational. During the **Briefing Phase**, be a high-fidelity intelligence officer.

After every briefing response, check:
- Did I check the Self-Healing logs?
- Did I mention the last Action Plan (Listening Well/Tutor)?
- Did I include the most relevant Blog/GitHub updates?
- Is the tone supportive yet precise?

If no: correct in the next briefing.

---

## Global Session State (Memory)

This skill reads from the following state files in `/Users/igorsilva/.openclaw/workspace/state/`:
- `self-healing-history.md`: For overnight system events.
- `listening-well-log.md`: For the most recent CBT Action Plan.
- `tutor-log.md`: For the last communication exercise.
- `research-log.md`: For the current research focus.

---

## Procedure

### The Lobby (Good Morning)

If the user runs `/briefing`:
1. **Greet Warmly**: "Good morning, Igor. Ready for today's mission briefing?"
2. **Initial Check-in**: "I'm compiling your overnight stats, news, and where we left off yesterday. Shall we start with the system health or jump straight into the intel?"

### The Briefing Phase

**1. System Health Intelligence**
- Check `/Users/igorsilva/.openclaw/workspace/state/self-healing-history.md`.
- Summarize any overnight recoveries.
- Current Status: Run a quick check on Gateway and Tandem.

**2. Personal Continuity (Unfinished Business)**
- Check `listening-well-log.md` and `tutor-log.md`.
- Highlight the last "Action Plan": *"Reminder: You planned to [Action Plan] today. Ready for that?"*
- Check `research-log.md`: *"We were investigating [Topic] yesterday. Should I look for more updates on this?"*

**3. External Intel (News & Code)**
- Run `exec: /Users/igorsilva/go/bin/blogwatcher articles --limit 5`
- Run `exec: /usr/bin/python3 /Users/igorsilva/clawd/skills/github-monitor/scripts/github-monitor.py --repos anthropics/claude-code,modelcontextprotocol/servers --output-format brief`
- Synthesize: Pick the 2-3 most relevant items and explain *why* they matter to current focuses.

---

## Inputs
- **config** (optional): `full` (All sections), `intel` (News/GitHub only), `health` (System status only).

## Outputs
- **Mission Briefing**: A unified daily dashboard.
- **Action Reminder**: Specific prompts for pending homework/research.

---

## Failure modes

| Pattern | Signal | Fix |
|---|---|---|
| Script Missing | blogwatcher or github-monitor fails | Report the missing dependency and provide the rest of the briefing. |
| Log Gaps | State files don't exist yet | Skip the continuity section and invite the user to start their first mission. |
| Gateway Down | http://localhost:18789/ fails | Prioritize this as a CRITICAL recovery alert in the briefing. |

---

## Acceptance tests

1. `/briefing`
   → Agent starts the Lobby phase with a warm "Good morning."
   → Expected: The output contains a check-in question before providing the full briefing.

2. `/briefing` full
   → Agent provides a unified dashboard including Health, Continuity, and Intel.
   → Expected: The output contains sections for "System Health," "Unfinished Business," and "Intel."

3. `/briefing` intel
   → Agent focuses specifically on Blog and GitHub updates.
   → Expected: The output starts with "📰 New Articles" or "🔧 GitHub Updates."

4. Negative Case — Missing Logs:
   → If state files in `workspace/state/` are missing.
   → Expected: The output omits the continuity section and continues with news/health without erroring.

5. Negative Case — Scripture Failure:
   → If `blogwatcher` returns a non-zero exit code.
   → Expected: The output reports the failure and continues with the rest of the briefing.

---

## Toolset
- /Users/igorsilva/go/bin/blogwatcher
- /usr/bin/python3 (for github-monitor.py)

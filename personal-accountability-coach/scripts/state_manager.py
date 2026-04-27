import os
import json
import re
from datetime import datetime

LOG_PATH = os.path.expanduser("~/.openclaw/workspace/state/accountability-log.md")

def parse_log():
    if not os.path.exists(LOG_PATH):
        return {"last_commitment": None, "recent_avoidance": [], "history": [], "rankings": {}, "investment": 0}

    with open(LOG_PATH, "r") as f:
        content = f.read()

    # Find the last commitment in '## Commitments' section
    commitments = []
    commitment_matches = re.findall(r"### (\d{4}-\d{2}-\d{2})\n- \*\*Commitment:\*\* (.*?)\n- \*\*Deadline:\*\* (.*?)\n- \*\*Result:\*\* (.*?)\n", content, re.DOTALL)
    
    for date, goal, deadline, result in commitment_matches:
        commitments.append({
            "date": date,
            "commitment": goal.strip(),
            "deadline": deadline.strip(),
            "result": result.strip()
        })

    # Find A B C D E Rankings
    rankings = {}
    rank_matches = re.findall(r"- \*\*([A-E]-\d?)\*\*:\s*(.*)", content)
    for rank, task in rank_matches:
        rankings[rank] = task.strip()

    # Find Law of Three
    law_of_three = re.findall(r"- \*\*Law of Three\*\*:\s*(.*)", content)
    
    # Calculate Total Investment (3% Formula)
    investment_matches = re.findall(r"- \*\*Investment:\*\* \$(\d+)", content)
    total_investment = sum(int(amt) for amt in investment_matches)

    # Find recent avoidance incidents
    avoidance = []
    avoidance_matches = re.findall(r"### (\d{4}-\d{2}-\d{2})\n- \*\*IQ used:\*\* (.*?)\n- \*\*Redirect:\*\* (.*?)\n", content, re.DOTALL)
    for date, iq, redirect in avoidance_matches[-5:]: # Last 5
        avoidance.append({"date": date, "iq": iq.strip(), "redirect": redirect.strip()})

    # Calculate drift score
    consecutive_no_win = 0
    for entry in reversed(commitments):
        if entry["result"].lower() in ["pending", "failed", "", "no"]:
            consecutive_no_win += 1
        else:
            break

    excuse_counts = {}
    for incident in avoidance:
        tag = incident["iq"]
        excuse_counts[tag] = excuse_counts.get(tag, 0) + 1
    repeated_excuses = sum(1 for count in excuse_counts.values() if count > 1)

    drift_score = min(consecutive_no_win, 3) + min(repeated_excuses, 2)

    return {
        "last_commitment": commitments[-1] if commitments else None,
        "recent_avoidance": avoidance,
        "sessions": commitments[-5:],
        "rankings": rankings,
        "law_of_three": law_of_three,
        "total_investment": total_investment,
        "drift_score": drift_score
    }

def write_session(commitment: str, deadline: str, result: str, identity_vote: str, iq_used: str = None, redirect: str = None):
    """
    Appends a new session entry to the accountability log.
    
    Args:
        commitment: The A-Task commitment stated by the user.
        deadline: The deadline in plain text (e.g. "Thursday at 5pm").
        result: One of: "pending", "completed", "failed".
        identity_vote: The vote tag (e.g. "BUILDER", "DRIFTING").
        iq_used: Optional. The excuse archetype tag if one was detected.
        redirect: Optional. The QBQ redirect used if an IQ was detected.
    """
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Build commitment entry
    commitment_entry = f"""
### {today}
- **Commitment:** {commitment}
- **Deadline:** {deadline}
- **Result:** {result}
- **Identity Vote:** {identity_vote}
- **Logged:** {timestamp}
"""

    # Build avoidance entry if IQ was used
    avoidance_entry = ""
    if iq_used:
        avoidance_entry = f"""
### {today}
- **IQ used:** {iq_used}
- **Redirect:** {redirect or "None provided"}
"""

    # Read existing log or create with headers
    if os.path.exists(LOG_PATH):
        with open(LOG_PATH, "r") as f:
            content = f.read()
    else:
        content = """# Personal Accountability Log

## Commitments

## Avoidance Incidents

## Task Rankings (A B C D E)

## Law of Three

## Professional Investment (3% Formula)
"""

    # Append commitment entry under ## Commitments
    if "## Commitments" in content:
        content = content.replace(
            "## Commitments",
            f"## Commitments\n{commitment_entry}",
            1
        )
    else:
        content += f"\n## Commitments\n{commitment_entry}"

    # Append avoidance entry under ## Avoidance Incidents
    if avoidance_entry:
        if "## Avoidance Incidents" in content:
            content = content.replace(
                "## Avoidance Incidents",
                f"## Avoidance Incidents\n{avoidance_entry}",
                1
            )
        else:
            content += f"\n## Avoidance Incidents\n{avoidance_entry}"

    with open(LOG_PATH, "w") as f:
        f.write(content)

    return {"status": "logged", "date": today, "commitment": commitment, "identity_vote": identity_vote}

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "write" and len(sys.argv) > 2:
        # Called from handler.ts with a JSON payload
        # Usage: python state_manager.py write '<json_payload>'
        payload = json.loads(sys.argv[2])
        result = write_session(
            commitment=payload.get("commitment", ""),
            deadline=payload.get("deadline", "pending"),
            result=payload.get("result", "pending"),
            identity_vote=payload.get("identity_vote", "OBSERVER"),
            iq_used=payload.get("iq_used"),
            redirect=payload.get("redirect")
        )
        print(json.dumps(result, indent=2))
    else:
        print(json.dumps(parse_log(), indent=2))

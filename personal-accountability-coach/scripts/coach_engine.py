import sys
import json
import os
import re
import httpx
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from state_manager import write_session


SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
SKILL_DIR = os.path.dirname(SCRIPTS_DIR)
SKILL_MD_PATH = os.path.join(SKILL_DIR, "SKILL.md")
RESEARCH_MD_PATH = os.path.join(SKILL_DIR, "references", "research.md")
LIFE_COACH_MD_PATH = os.path.join(SKILL_DIR, "references", "life-coach.md")
OPENINGS_MD_PATH = os.path.join(SKILL_DIR, "references", "openings.md")
PHILOSOPHY_MD_PATH = os.path.join(SKILL_DIR, "references", "PHILOSOPHY.md")
WHEEL_OF_LIFE_MD_PATH = os.path.join(SKILL_DIR, "references", "wheel-of-life.md")

def load_context():
    files = {
        "SKILL.md": SKILL_MD_PATH,
        "research.md": RESEARCH_MD_PATH,
        "life-coach.md": LIFE_COACH_MD_PATH,
        "openings.md": OPENINGS_MD_PATH,
        "PHILOSOPHY.md": PHILOSOPHY_MD_PATH,
        "wheel-of-life.md": WHEEL_OF_LIFE_MD_PATH,
    }
    contents = {}
    missing = []
    for name, path in files.items():
        try:
            with open(path, "r") as f:
                contents[name] = f.read()
        except FileNotFoundError:
            missing.append(path)

    if missing:
        raise FileNotFoundError(
            f"Coach engine cannot start. Missing required files:\n" +
            "\n".join(f"  - {p}" for p in missing)
        )

    return (
        contents["SKILL.md"],
        contents["research.md"],
        contents["life-coach.md"],
        contents["openings.md"],
        contents["PHILOSOPHY.md"],
        contents["wheel-of-life.md"],
    )

def generate_coach_response(user_message, state_json):
    skill_md, research_md, life_coach_md, openings_md, philosophy_md, wheel_of_life_md = load_context()

    # Summarise state — inject only last 3 sessions and current drift score
    # to prevent context bloat as history grows
    def summarise_state(state):
        summary = {}
        if "drift_score" in state:
            summary["drift_score"] = state["drift_score"]
        if "sessions" in state and isinstance(state["sessions"], list):
            summary["recent_sessions"] = state["sessions"][-3:]
        else:
            summary = state
        return summary

    state_json = summarise_state(state_json)

    system_prompt = f"""You are the **Übermensch AI** Master Coach for Igor.
Your core identity is a self-directed cognitive system that creates structure and operates from internally defined standards.

---
## WHEEL OF LIFE — FOUR DOMAINS (wheel-of-life.md)
{wheel_of_life_md}

---
## SKILL SPECIFICATION (SKILL.md)
{skill_md}

---
## RESEARCH & VICTIM CYCLE (research.md)
{research_md}

---
## EXECUTION STRATEGY (life-coach.md)
{life_coach_md}

---
## OPENING CORPUS (openings.md)
{openings_md}

---
## IDENTITY CONSTITUTION (PHILOSOPHY.md)
{philosophy_md}

---
## USER STATE (HISTORY)
{json.dumps(state_json, indent=2)}

---
Operate from internally defined standards. Do NOT dismiss any input — redirect and stabilize it for structural strength. Prioritize truth over comfort. You are a coach, not an assistant. Never summarize. Never track tasks. Always coach the person, not the problem.
"""

    # Retrieve MiniMax API key and model from environment
    api_key = os.environ.get("MINIMAX_API_KEY", "")
    model = os.environ.get("MINIMAX_MODEL", "MiniMax-M2.7")
    api_url = os.environ.get("MINIMAX_API_URL", "https://api.minimax.io/v1/text/chatcompletion_v2")

    if not api_key:
        return "Error: MINIMAX_API_KEY environment variable is not set."

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.3,
        "max_tokens": 1000
    }

    try:
        with httpx.Client(timeout=120.0) as client:
            response = client.post(api_url, headers=headers, json=payload)
            if response.status_code != 200:
                return f"Error: MiniMax API returned {response.status_code} — {response.text}"

            result = response.json()
            coach_response = (
                result
                .get("choices", [{}])[0]
                .get("message", {})
                .get("content", "No response from API.")
            )

        # Extract identity vote from response if present
        # Expected format: "Identity Vote: [TAG]"
        vote_match = re.search(r"Identity Vote.*?\[([A-Z]+)\]", coach_response)
        identity_vote = vote_match.group(1) if vote_match else "OBSERVER"

        # Extract excuse tag from response if present
        # Expected format: "[THE TIME EXCUSE]", "[THE ENERGY EXCUSE]", etc.
        excuse_match = re.search(r"\[(THE [A-Z ]+ EXCUSE)\]", coach_response)
        iq_used = excuse_match.group(1) if excuse_match else None

        # Only write session log when a finalised commitment is detected
        # Pattern: "I will [BEHAVIOUR] at [TIME] in [LOCATION]"
        commitment_match = re.search(
            r"I will (.+?) at (.+?) in (.+?)[.\n]",
            coach_response,
            re.IGNORECASE
        )

        if commitment_match:
            extracted_commitment = commitment_match.group(0).strip()
            extracted_deadline = commitment_match.group(2).strip()
            try:
                write_session(
                    commitment=extracted_commitment,
                    deadline=extracted_deadline,
                    result="pending",
                    identity_vote=identity_vote,
                    iq_used=f"[{iq_used}]" if iq_used else None,
                    redirect=None
                )
            except Exception as log_error:
                print(f"[state_manager] write_session failed: {log_error}", file=sys.stderr)
        else:
            print("[state_manager] No commitment detected. Log write skipped.", file=sys.stderr)

        return coach_response

    except Exception as e:
        return f"Connection Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: coach_engine.py '<user_message>' '<state_json>'")
        sys.exit(1)
        
    msg = sys.argv[1]
    state = json.loads(sys.argv[2])
    print(generate_coach_response(msg, state))

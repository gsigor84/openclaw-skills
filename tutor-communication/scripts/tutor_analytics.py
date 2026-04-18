import re
import sys
import os
from pathlib import Path
from datetime import datetime

# --- Configuration ---
LOG_FILE = Path("/Users/igorsilva/.openclaw/workspace/state/tutor-log.md")
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_RED = "\033[91m"
COLOR_CYAN = "\033[96m"
COLOR_BOLD = "\033[1m"
COLOR_END = "\033[0m"

class TutorIntelligence:
    def __init__(self, log_path):
        self.log_path = log_path
        self.sessions = []
        self._parse_log()

    def _parse_log(self):
        if not self.log_path.exists():
            return

        content = self.log_path.read_text()
        # Regex for high-fidelity V1.3+ session blocks
        session_blocks = re.split(r"### Session Date: \[\d{4}-\d{2}-\d{2}\]|### \d{4}-\d{2}-\d{2}", content)
        
        # Get dates separately to match blocks
        dates = re.findall(r"(\d{4}-\d{2}-\d{2})", content)
        
        for i, block in enumerate(session_blocks[1:]):
            if i >= len(dates): break
            date = dates[i]
            
            # Extract fields
            topic = re.search(r"- \*\*Topic\*\*: (.*)", block)
            framework = re.search(r"- \*\*Framework Practiced\*\*: (.*)", block)
            observation = re.search(r"- \*\*Observation\*\*: (.*)", block)
            next_step = re.search(r"- \*\*Next Step\*\*: (.*)", block)
            
            self.sessions.append({
                "date": date,
                "topic": topic.group(1) if topic else "General Coaching",
                "framework": framework.group(1) if framework else "None",
                "observation": observation.group(1) if observation else "",
                "next_step": next_step.group(1) if next_step else ""
            })

    def get_stats(self):
        if not self.sessions:
            return "No data available."

        # Minto Score Logic: Search for 'Minto' and 'Logic' in observations
        minto_hits = [s for s in self.sessions if "minto" in s['observation'].lower()]
        progression = len([s for s in minto_hits if "progress" in s['observation'].lower() or "accurate" in s['observation'].lower()])
        adherence_score = (progression / len(minto_hits) * 100) if minto_hits else 0

        # Friction Detection: Count repeats of same framework
        framework_counts = {}
        for s in self.sessions:
            f = s['framework']
            if f != "None":
                framework_counts[f] = framework_counts.get(f, 0) + 1
        
        stalled = [f for f, count in framework_counts.items() if count >= 3]

        return {
            "minto_adherence": adherence_score,
            "session_count": len(self.sessions),
            "stalled_frameworks": stalled,
            "latest_next_step": self.sessions[-1]['next_step'] if self.sessions else "None"
        }

    def render_dashboard(self):
        stats = self.get_stats()
        if isinstance(stats, str):
            print(f"{COLOR_RED}{stats}{COLOR_END}")
            return

        print(f"\n{COLOR_CYAN}{'='*60}{COLOR_END}")
        print(f"{COLOR_BOLD}   ADAM TUTOR INTELLIGENCE DASHBOARD (V1.3 GOLDEN){COLOR_END}")
        print(f"{COLOR_CYAN}{'='*60}{COLOR_END}")
        
        # 1. Structural Integrity (Minto)
        score = stats['minto_adherence']
        color = COLOR_GREEN if score >= 80 else COLOR_YELLOW if score >= 50 else COLOR_RED
        bar = "█" * int(score/5) + "░" * (20 - int(score/5))
        print(f"\nMINTO ADHERENCE SCORE:  [{color}{bar}{COLOR_END}] {score:.1f}%")
        
        # 2. Key Metrics
        print(f"Total Coaching Cycles: {COLOR_BOLD}{stats['session_count']}{COLOR_END}")
        print(f"Latest Topic:         {COLOR_BOLD}{self.sessions[-1]['topic'] if self.sessions else 'N/A'}{COLOR_END}")
        
        # 3. Friction Alerts (Stalls)
        print(f"\n{COLOR_BOLD}SKILL FRICTION ALERTS:{COLOR_END}")
        if stats['stalled_frameworks']:
            for f in stats['stalled_frameworks']:
                print(f" {COLOR_RED}⚠ STALLED:{COLOR_END} {f} (Needs SCQR reframing)")
        else:
            print(f" {COLOR_GREEN}✓ NO STALLS DETECTED{COLOR_END} (Excellent progression)")

        # 4. Pre-Flight Briefing (Next Session)
        print(f"\n{COLOR_CYAN}{'-'*60}{COLOR_END}")
        print(f"{COLOR_BOLD}PRE-FLIGHT BRIEFING (NEXT SESSION):{COLOR_END}")
        print(f" FOCUS: {stats['latest_next_step']}")
        print(f"{COLOR_CYAN}{'-'*60}{COLOR_END}\n")

if __name__ == "__main__":
    intel = TutorIntelligence(LOG_FILE)
    if "--brief" in sys.argv:
        stats = intel.get_stats()
        print(f"FOCUS: {stats['latest_next_step'] if not isinstance(stats, str) else 'N/A'}")
    else:
        intel.render_dashboard()

import re
import json
import pandas as pd
from pathlib import Path

class SemanticParser:
    """
    Tutor Intelligence V2.0: Pure deterministic semantic parser.
    Extracts 12 dimensions from high-fidelity coaching logs.
    """
    def __init__(self, log_path):
        self.log_path = Path(log_path)
        self.dimensions_schema = [
            "date", "topic", "framework", 
            "minto_adherence", "framework_usage", "friction_count",
            "progress_velocity", "gap_vector", "stall_signature",
            "structural_depth", "persona_drift", "synthesis_bridges",
            "recovery_rate"
        ]

    def parse(self):
        if not self.log_path.exists():
            return pd.DataFrame(columns=self.dimensions_schema)

        content = self.log_path.read_text()
        sessions = re.split(r"### Session Date: \[\d{4}-\d{2}-\d{2}\]|### \d{4}-\d{2}-\d{2}", content)
        dates = re.findall(r"(\d{4}-\d{2}-\d{2})", content)
        
        parsed_data = []
        for i, block in enumerate(sessions[1:]):
            if i >= len(dates): break
            parsed_data.append(self._extract_dimensions(dates[i], block))
            
        return pd.DataFrame(parsed_data)

    def _extract_dimensions(self, date, block):
        # 1. Basic Metadata
        topic_match = re.search(r"- \*\*Topic\*\*: (.*)", block)
        framework_match = re.search(r"- \*\*Framework Practiced\*\*: (.*)", block)
        observation = re.search(r"- \*\*Observation\*\*: (.*)", block).group(1) if re.search(r"- \*\*Observation\*\*: (.*)", block) else ""
        
        # 2. Minto Adherence (0.0 - 1.0)
        # Heuristic: Presence of Answer + Support/SCQR structure
        minto_score = 0.0
        if re.search(r"Answer.*support|SCQR|top-down", observation.lower()):
            minto_score = 0.9 if "accurate" in observation.lower() else 0.5
        elif "logic gaps detected" in observation.lower():
            minto_score = 0.2
            
        # 3. Persona Drift (0.0 - 1.0, low is better)
        # Blacklist: good, great, seems, interesting, perhaps
        drift_hits = len(re.findall(r"good|great|seems|interesting|perhaps", observation.lower()))
        persona_drift = min(1.0, drift_hits * 0.2)

        # 4. Synthesis Bridges — structural intent, not keyword presence
        bridge_patterns = [
            r"(connects?|links?|bridges?)\s+\w+\s+(to|with|and)\s+\w+",  # explicit bridge act
            r"(because|therefore|which means|leads to|results in)",        # causal direction
            r"(both|all three|these two)\s+\w+\s+(share|have|show)",       # grouping synthesis
        ]
        bridge_count = sum(len(re.findall(p, observation.lower())) for p in bridge_patterns)
        
        # 5. Gap Vector — now fully decoupled from bridge detection
        gap_vector = {
            "causal": 1 if re.search(r"because|therefore|leads to|results in", observation.lower()) else 0,
            "grouping": 1 if re.search(r"island|group|cluster|category", observation.lower()) else 0
        }

        # 6. Structural Depth
        # Heuristic: Count of distinct logic points or levels mentioned
        depth = len(re.findall(r"resolution|situation|complication|question", observation.lower()))

        return {
            "date": date,
            "topic": topic_match.group(1) if topic_match else "General",
            "framework": framework_match.group(1) if framework_match else "None",
            "minto_adherence": minto_score,
            "persona_drift": persona_drift,
            "synthesis_bridges": bridge_count,
            "structural_depth": depth,
            "gap_vector": json.dumps(gap_vector),
            "friction_count": 1 if "stalled" in observation.lower() or "loop" in observation.lower() else 0,
            "recovery_rate": 1 if "resolved" in observation.lower() or "progress" in observation.lower() else 0,
            # Placeholders for rolling/stats logic (to be filled by store/engine)
            "progress_velocity": 0.0,
            "stall_signature": "none"
        }

if __name__ == "__main__":
    parser = SemanticParser("/Users/igorsilva/.openclaw/workspace/state/tutor-log.md")
    df = parser.parse()
    print(df.to_string())

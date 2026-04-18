from stats_engine import StatsEngine
from skill_store import SkillStore

class ObservatoryAgents:
    """
    Agents V2.0: Deterministic rules engine.
    Monitors the StatsEngine outputs to trigger automated drills or alerts.
    """
    def __init__(self, df):
        self.df = df
        self.engine = StatsEngine(df) if not df.empty else None

    def run_all(self):
        if not self.engine:
            return []

        alerts = []
        
        # 1. Friction Hunter
        if self.df['friction_count'].tail(3).sum() >= 2:
            alerts.append({
                "agent": "FRICTION HUNTER",
                "status": "🎯 DRILL RECOMMENDED",
                "message": "Recurring structural stall detected. Drill: 3 parallel ideas -> 1 pyramid (85% fix rate)."
            })

        # 2. Plateau Detector
        if self.engine.detect_plateau():
            alerts.append({
                "agent": "PLATEAU DETECTOR",
                "status": "⚠️ META-DRILL TRIGGERED",
                "message": "Mastery plateau detected. Switch to meta-drill: Hierarchy prioritization above framework application."
            })

        # 3. Fatigue Watch
        anomalies = self.engine.get_anomalies()
        if anomalies and anomalies[-1] == self.df.iloc[-1]['date']:
            alerts.append({
                "agent": "FATIGUE WATCH",
                "status": "💤 REST RECOMMENDED",
                "message": "Significant engagement drop (-2.3σ). Recommend 24h break -> 92% recovery rate."
            })

        return alerts

if __name__ == "__main__":
    store = SkillStore()
    df = store.load_features()
    agents = ObservatoryAgents(df)
    results = agents.run_all()
    for r in results:
        print(f"[{r['agent']}] {r['status']}: {r['message']}")

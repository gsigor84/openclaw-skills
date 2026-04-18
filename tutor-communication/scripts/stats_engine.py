import numpy as np
import pandas as pd
from scipy import stats
from sklearn.cluster import KMeans
from skill_store import SkillStore

class StatsEngine:
    """
    ML Engine V2.0: Pure stats + lightweight clustering.
    Identifies behavioral patterns and forecasts progression.
    """
    def __init__(self, df):
        self.df = df
        
    def get_friction_clusters(self, k=3):
        """Perform K-Means clustering on the 'gap_vector' and 'minto_adherence'."""
        if len(self.df) < k:
            return "Insufficient data for clustering."
            
        features = self.df[['minto_adherence', 'persona_drift', 'synthesis_bridges']].values
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10).fit(features)
        
        # Identify the most frequent cluster for errors
        labels = kmeans.labels_
        return f"Primary stall cluster identified in {len([l for l in labels if l == stats.mode(labels)[0][0]])} sessions."

    def get_velocity_trend(self):
        """Perform Linear Regression on Minto Adherence over the last 10 sessions."""
        if len(self.df) < 5:
            return 0.0, 0.0
            
        y = self.df['minto_adherence'].values
        x = np.arange(len(y))
        slope, intercept, r_value, p_value, std_err = stats.linregress(x[-10:], y[-10:])
        
        return slope, r_value

    def detect_plateau(self, variance_threshold=0.1, velocity_threshold=0.01):
        """
        Plateau detection: low variance AND near-zero velocity.
        Variance alone flags slow progress as plateau — velocity check prevents false positives.
        """
        if len(self.df) < 5:
            return False

        window = self.df['minto_adherence'].rolling(window=5)
        rolling_var = window.var().iloc[-1]
        
        # Velocity: slope of last 5 sessions
        velocity = self.df['minto_adherence'].iloc[-5:].diff().mean()

        return rolling_var < variance_threshold and abs(velocity) < velocity_threshold and self.df['minto_adherence'].iloc[-1] < 0.9

    def get_anomalies(self, z_threshold=2.0, min_sessions=10):
        """Z-Score anomaly detection. Requires min_sessions for stable scoring."""
        if len(self.df) < min_sessions:
            return []  # insufficient data for reliable z-score
            
        depths = self.df['structural_depth'].values
        z_scores = np.abs(stats.zscore(depths))
        
        anomaly_indices = np.where(z_scores > z_threshold)[0]
        return [self.df.iloc[i]['date'] for i in anomaly_indices]

if __name__ == "__main__":
    store = SkillStore()
    df = store.load_features()
    if not df.empty:
        engine = StatsEngine(df)
        slope, r = engine.get_velocity_trend()
        print(f"Progression Velocity: {slope:.3f}/session (R={r:.2f})")
        print(f"Plateau Detected: {engine.detect_plateau()}")
        print(f"Anomalies: {engine.get_anomalies()}")

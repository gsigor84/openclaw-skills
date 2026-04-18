import sqlite3
import json
import pandas as pd
from pathlib import Path
from tutor_parser import SemanticParser

DB_PATH = Path("/Users/igorsilva/.openclaw/workspace/state/skill_data.db")
LOG_PATH = Path("/Users/igorsilva/.openclaw/workspace/state/tutor-log.md")

class SkillStore:
    """
    Feature Store V2.0: SQLite + Pandas for deterministic session history.
    """
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS skill_vectors (
                    date TEXT PRIMARY KEY,
                    topic TEXT,
                    framework TEXT,
                    minto_adherence FLOAT,
                    persona_drift FLOAT,
                    synthesis_bridges INTEGER,
                    structural_depth INTEGER,
                    gap_vector TEXT,
                    friction_count INTEGER,
                    recovery_rate INTEGER,
                    progress_velocity FLOAT,
                    stall_signature TEXT
                )
            """)

    def sync_logs(self):
        """Synchronize raw markdown logs with the SQLite feature store."""
        parser = SemanticParser(LOG_PATH)
        df = parser.parse()
        
        if df.empty:
            return 0
            
        with sqlite3.connect(self.db_path) as conn:
            # Upsert into SQLite
            df.to_sql("skill_vectors", conn, if_exists="replace", index=False)
        
        return len(df)

    def load_features(self, window=20):
        """Load features into a Pandas DataFrame with rolling windows."""
        with sqlite3.connect(self.db_path) as conn:
            df = pd.read_sql("SELECT * FROM skill_vectors ORDER BY date ASC", conn)
            
        if df.empty:
            return df

        # Deserialize gap_vector
        df['gap_vector'] = df['gap_vector'].apply(lambda x: json.loads(x) if isinstance(x, str) else x)

        # Enrich with rolling stats
        df['minto_rolling_5'] = df['minto_adherence'].rolling(window=min(5, len(df))).mean()
        df['velocity_rolling_5'] = df['minto_adherence'].diff().rolling(window=min(5, len(df))).mean().fillna(0)
        
        return df

if __name__ == "__main__":
    store = SkillStore()
    count = store.sync_logs()
    print(f"Synced {count} sessions.")
    print(store.load_features().tail())

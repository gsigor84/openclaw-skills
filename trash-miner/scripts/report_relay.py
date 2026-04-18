import os
import shutil
import glob
from datetime import datetime

# Paths
SOURCE_DIR = "/Users/igorsilva/PycharmProjects/trash_miner/openclaw_miner/data/normalized"
TARGET_DIR = "/Users/igorsilva/clawd/data/trash_miner"

def relay_latest_report():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)
        
    # Find latest insight report
    reports = glob.glob(os.path.join(SOURCE_DIR, "niche_insight_report_*.md"))
    if not reports:
        print("Error: No insight reports found in source directory.")
        return
    
    latest_report = max(reports, key=os.path.getctime)
    ts = datetime.now().strftime("%Y%m%d_%H%M")
    filename = os.path.basename(latest_report)
    
    target_path = os.path.join(TARGET_DIR, filename)
    
    try:
        shutil.copy2(latest_report, target_path)
        print(f"Success: Report relayed to {target_path}")
    except Exception as e:
        print(f"Error: Failed to copy report: {str(e)}")

if __name__ == "__main__":
    relay_latest_report()

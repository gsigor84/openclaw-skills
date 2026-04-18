import json
import os
import sys

def validate(file_path):
    if not os.path.exists(file_path):
        print(f"[ERROR] Harvest file not found: {file_path}")
        sys.exit(1)

    counts = {}
    total = 0
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip(): continue
                try:
                    data = json.loads(line)
                    # Handle both RawIngestionEvent nest and legacy flat format
                    payload = data.get('raw_payload', data) 
                    sub = payload.get('subreddit') or payload.get('subreddit_feed') or 'unknown'
                    counts[sub] = counts.get(sub, 0) + 1
                    total += 1
                except:
                    continue
    except Exception as e:
        print(f"[ERROR] Failed to read {file_path}: {e}")
        sys.exit(1)

    print(f"\n{'='*30}")
    print(f"  HARVEST VALIDATION")
    print(f"{'='*30}")
    print(f"Total Signals Found: {total}")
    for sub, count in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  - r/{sub:15s} : {count:3d}")
    
    if total < 5:
        print(f"\n[CRITICAL] Error: Only {total} signals found.")
        print("Analysis requires at least 5 signals to detect structural gaps.")
        print("Recommendation: Use broader seeds or check if subreddits are dead.")
        print(f"{'='*30}\n")
        sys.exit(1)
    
    print(f"\n[SUCCESS] Volume check passed. Proceeding to Intelligence Pass.")
    print(f"{'='*30}\n")

if __name__ == "__main__":
    # Target the project data directory by default
    path = sys.argv[1] if len(sys.argv) > 1 else "/Users/igorsilva/PycharmProjects/trash_miner/data/reddit_threads.jsonl"
    validate(path)

#!/opt/anaconda3/bin/python3
import argparse
import os
import re
import sys
import json

LEDGER_PATH = "/Users/igorsilva/.openclaw/workspace/state/coach-log.md"

def get_interests():
    if not os.path.exists(LEDGER_PATH):
        return []
    with open(LEDGER_PATH, 'r') as f:
        content = f.read()
    
    # Extract Phase 1 list
    section_start = "## Phase 1: Interest Inventory (Raw)"
    section_end = "---"
    pattern = re.escape(section_start) + r"(.*?)" + re.escape(section_end)
    match = re.search(pattern, content, re.S)
    
    if not match:
        return []
    
    interests = [l.strip("- ").strip() for l in match.group(1).splitlines() if l.strip("- ").strip()]
    return interests

def record_linc(pair, scores):
    # pair is (Interest A, Interest B)
    # scores is { 'L': 0/1, 'I': 0/1, 'N': 0/1, 'C': 0/1 }
    with open(LEDGER_PATH, 'r') as f:
        content = f.read()
    
    total = sum(scores.values())
    score_str = f"- **{pair[0]}** + **{pair[1]}** | L:{scores['L']} I:{scores['I']} N:{scores['N']} C:{scores['C']} | **Total: {total}/4**"
    
    # Find Phase 2 section
    section_start = "## Phase 2: LINC Scores (Mapping Connections)"
    section_end = "---"
    pattern = re.escape(section_start) + r"(.*?)" + re.escape(section_end)
    match = re.search(pattern, content, re.S)
    
    if not match:
        return False
    
    existing = match.group(1).strip()
    updated = existing + "\n" + score_str if existing else score_str
    
    new_section = f"{section_start}\n\n{updated}\n\n"
    content = content.replace(match.group(0), new_section + section_end)
    
    with open(LEDGER_PATH, 'w') as f:
        f.write(content)
    return True

def main():
    parser = argparse.ArgumentParser(description="Run LINC Audit")
    subparsers = parser.add_subparsers(dest="command")
    
    list_parser = subparsers.add_parser("list")
    
    score_parser = subparsers.add_parser("score")
    score_parser.add_argument("a")
    score_parser.add_argument("b")
    score_parser.add_argument("--l", type=int, default=0)
    score_parser.add_argument("--i", type=int, default=0)
    score_parser.add_argument("--n", type=int, default=0)
    score_parser.add_argument("--c", type=int, default=0)
    
    args = parser.parse_args()
    
    if args.command == "list":
        interests = get_interests()
        for i in interests:
            print(f"- {i}")
            
    elif args.command == "score":
        scores = {'L': args.l, 'I': args.i, 'N': args.n, 'C': args.c}
        if record_linc((args.a, args.b), scores):
            print(f"Recorded LINC score for {args.a} + {args.b}")
        else:
            print("Failed to record score.")

if __name__ == "__main__":
    main()

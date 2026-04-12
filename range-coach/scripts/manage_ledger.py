#!/opt/anaconda3/bin/python3
import argparse
import os
import re
import sys

LEDGER_PATH = "/Users/igorsilva/.openclaw/workspace/state/coach-log.md"

def read_ledger():
    if not os.path.exists(LEDGER_PATH):
        return None
    with open(LEDGER_PATH, 'r') as f:
        return f.read()

def write_ledger(content):
    with open(LEDGER_PATH, 'w') as f:
        f.write(content)

def update_phase(new_phase, status="ACTIVE"):
    content = read_ledger()
    if not content:
        return False
    
    # Update Status Section
    content = re.sub(r"- **Phase**: \d+", f"- **Phase**: {new_phase}", content)
    content = re.sub(r"- **Status**: \[.*\]", f"- **Status**: [{status}]", content)
    
    write_ledger(content)
    return True

def add_interests(interests):
    content = read_ledger()
    if not content:
        return False
    
    # Find Phase 1 section
    section_start = "## Phase 1: Interest Inventory (Raw)"
    section_end = "---"
    
    pattern = re.escape(section_start) + r"(.*?)" + re.escape(section_end)
    match = re.search(pattern, content, re.S)
    
    if not match:
        return False
    
    existing_list = match.group(1).splitlines()
    # Filter out placeholder text
    existing_list = [l for l in existing_list if l.strip() and "*" not in l]
    
    new_list = [f"- {i.strip()}" for i in interests]
    combined = "\n".join(existing_list + new_list)
    
    new_section = f"{section_start}\n\n{combined}\n\n"
    content = content.replace(match.group(0), new_section + section_end)
    
    write_ledger(content)
    return True

def main():
    parser = argparse.ArgumentParser(description="Manage the Range Coach Ledger")
    subparsers = parser.add_subparsers(dest="command")
    
    # Phase update
    phase_parser = subparsers.add_parser("phase")
    phase_parser.add_argument("number", type=int)
    phase_parser.add_argument("--status", default="ACTIVE")
    
    # Add interest
    interest_parser = subparsers.add_parser("add")
    interest_parser.add_argument("interests", nargs="+")
    
    args = parser.parse_args()
    
    if args.command == "phase":
        if update_phase(args.number, args.status):
            print(f"Updated Phase to {args.number} [{args.status}]")
        else:
            print("Failed to update phase.")
            sys.exit(1)
            
    elif args.command == "add":
        if add_interests(args.interests):
            print(f"Added {len(args.interests)} interests to Phase 1.")
        else:
            print("Failed to add interests.")
            sys.exit(1)

if __name__ == "__main__":
    main()

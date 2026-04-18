#!/usr/bin/env python3
import sys
import re

def sanitize(text):
    # Allowed: 
    # - Standard Latin (a-z, A-Z)
    # - Numbers (0-9)
    # - Punctuation and common symbols (. , ! ? ( ) " - _ + = @ # $ % & * : ; ' / \ )
    # - Latin Extended (Portuguese accents: á, é, í, ó, ú, à, ê, ô, ã, õ, ç, etc.)
    # - Whitespace
    
    # Range [ \u0000-\u007F] is Basic Latin
    # Range [ \u0080-\u00FF] is Latin-1 Supplement (includes PT accents)
    
    pattern = re.compile(r'[^\u0000-\u00FF\u2010-\u201D\u20AC]')
    
    matches = pattern.findall(text)
    if matches:
        return False, list(set(matches))
    return True, []

if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = sys.stdin.read()

    is_clean, bad_chars = sanitize(content)
    
    if not is_clean:
        print(f"[SANITY GATE] ERROR: Detected non-Latin artifacts: {', '.join(bad_chars)}")
        sys.exit(1)
    
    print("[SANITY GATE] PASS: Content is clean.")
    sys.exit(0)

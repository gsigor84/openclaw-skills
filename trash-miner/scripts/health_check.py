import sys
import subprocess
import json
import requests

def check_spacy():
    try:
        import spacy
        if spacy.util.is_package("en_core_web_sm"):
            return True, "spaCy and en_core_web_sm model found."
        else:
            return False, "spaCy is installed but 'en_core_web_sm' model is missing."
    except ImportError:
        return False, "spaCy is not installed."

def check_ollama():
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=2)
        if response.status_code == 200:
            return True, "Ollama is active."
        else:
            return False, f"Ollama returned status {response.status_code}."
    except Exception as e:
        return False, f"Ollama connection failed: {str(e)}"

def run_checks():
    spacy_ok, spacy_msg = check_spacy()
    ollama_ok, ollama_msg = check_ollama()
    
    results = {
        "status": "PASS" if (spacy_ok and ollama_ok) else "WARN" if (spacy_ok or ollama_ok) else "FAIL",
        "spacy": {"ok": spacy_ok, "message": spacy_msg},
        "ollama": {"ok": ollama_ok, "message": ollama_msg}
    }
    
    print(json.dumps(results, indent=2))
    
    if not spacy_ok:
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    run_checks()

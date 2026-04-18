import sys
import re
import json

class LogicAuditor:
    """
    Philosophic Logic Auditor V3.0.
    Enforces the Nietzschean Arc and Rabbi Adam persona constraints.
    """
    def __init__(self, text):
        self.text = text
        self.results = {"pass": True, "errors": []}

    def audit_all(self):
        self.check_sanity_gate()
        self.check_nietzschean_arc()
        self.check_tone_jargon()
        return self.results

    def check_sanity_gate(self):
        """Verifies character integrity (Legacy Sanity Gate)."""
        pattern = re.compile(r'[^\u0000-\u00FF\u2010-\u201D\u20AC]')
        bad_chars = pattern.findall(self.text)
        if bad_chars:
            self.results["pass"] = False
            self.results["errors"].append(f"Sanity Gate: Non-Latin artifacts detected: {set(bad_chars)}")

    def check_nietzschean_arc(self):
        """Verifies the presence of the 4-phase structural bridge."""
        phases = ["Pressure", "Breakaway", "Wilderness", "Renewal"]
        # In a high-fidelity implementation, this would use semantic detection.
        # For V3.0, we use header/marker detection in the draft.
        for phase in phases:
            if phase.lower() not in self.text.lower():
                self.results["pass"] = False
                self.results["errors"].append(f"Structural Gate: Phase '{phase}' missing from the Arc.")

    def check_tone_jargon(self):
        """Purges academic or philosophical jargon."""
        blacklist = ["Maimonides", "Nietzsche", "categorical imperative", "theological", "epistemology"]
        found = [word for word in blacklist if word.lower() in self.text.lower()]
        if found:
            self.results["pass"] = False
            self.results["errors"].append(f"Tone Gate: Philosophical jargon detected: {found}")

if __name__ == "__main__":
    content = sys.stdin.read()
    auditor = LogicAuditor(content)
    audit_results = auditor.audit_all()
    
    if not audit_results["pass"]:
        print(json.dumps(audit_results, indent=2))
        sys.exit(1)
    
    print("[LOGIC AUDITOR] PASS: Sermon is structurally sound and persona-consistent.")
    sys.exit(0)

import yaml
import os
import sys
from pathlib import Path

# --- Configuration ---
ASSETS_DIR = Path("/Users/igorsilva/.openclaw/skills/tutor-communication/assets")

class AssetLoader:
    """
    Intelligence Router for the Tutor Pedagogical Engine.
    Dynamically loads coaching assets (Personas, Drills, Templates).
    """
    def __init__(self, assets_dir=ASSETS_DIR):
        self.assets_dir = assets_dir

    def load_persona(self, persona_name):
        """Load a modular persona blueprint."""
        path = self.assets_dir / "personas" / f"{persona_name}.yaml"
        if not path.exists():
            return f"Error: Persona '{persona_name}' not found."
        
        with open(path, 'r') as f:
            return yaml.safe_load(f)

    def load_drill(self, drill_name):
        """Load a deterministic drill pack."""
        path = self.assets_dir / "drills" / f"{drill_name}.yaml"
        if not path.exists():
            return f"Error: Drill '{drill_name}' not found."
            
        with open(path, 'r') as f:
            return yaml.safe_load(f)

    def load_template(self, template_name):
        """Load a domain-specific SCQR template."""
        path = self.assets_dir / "templates" / f"{template_name}.yaml"
        if not path.exists():
            return f"Error: Template '{template_name}' not found."
            
        with open(path, 'r') as f:
            return yaml.safe_load(f)

if __name__ == "__main__":
    loader = AssetLoader()
    if len(sys.argv) > 2:
        category, name = sys.argv[1], sys.argv[2]
        if category == "--persona":
            print(loader.load_persona(name))
        elif category == "--drill":
            print(loader.load_drill(name))
        elif category == "--template":
            print(loader.load_template(name))
    else:
        print("Usage: asset_loader.py [--persona|--drill|--template] [name]")

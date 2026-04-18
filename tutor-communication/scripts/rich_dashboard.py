from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.layout import Layout
from rich.align import Align
from skill_store import SkillStore
from stats_engine import StatsEngine

console = Console()

def ascii_sparkline(data, width=40):
    """Simple ASCII sparkline implementation."""
    if not data: return ""
    chars = " ▂▃▄▅▆▇█"
    min_val, max_val = min(data), max(data)
    rng = max_val - min_val
    if rng == 0: return chars[4] * len(data)
    
    line = ""
    for v in data:
        idx = int(((v - min_val) / rng) * (len(chars) - 1))
        line += chars[idx]
    return line

class ObservatoryDashboard:
    """
    Visualization Layer V2.0: Multi-layer terminal UI.
    Renders the Intelligence Matrix, Radar, and Timeline.
    """
    def __init__(self, df):
        self.df = df
        self.engine = StatsEngine(df) if not df.empty else None

    def render(self):
        if self.df.empty:
            console.print("[red]No session data available. Start a session with /tutor.[/red]")
            return

        layout = Layout()
        layout.split(
            Layout(name="header", size=3),
            Layout(name="body"),
            Layout(name="footer", size=10)
        )
        
        layout["body"].split_row(
            Layout(name="metrics", ratio=2),
            Layout(name="constellation", ratio=1)
        )

        # 1. Header
        layout["header"].update(
            Panel(Align.center(f"[bold cyan]OBSERVATORY v2.0[/bold cyan] | [bold green]Velocity: {self.engine.get_velocity_trend()[0]:.3f}/sess[/bold green]"), style="cyan")
        )

        # 2. Intelligence Matrix
        matrix = Table(title="Intelligence Matrix", box=None, header_style="bold magenta")
        matrix.add_column("Metric", style="dim")
        matrix.add_column("Value", justify="right")
        
        latest = self.df.iloc[-1]
        matrix.add_row("Minto Adherence", f"{latest['minto_adherence']*100:.1f}%")
        matrix.add_row("Persona Drift", f"{latest['persona_drift']*100:.1f}%")
        matrix.add_row("Structural Depth", str(latest['structural_depth']))
        matrix.add_row("Recovery Rate", "100%" if latest['recovery_rate'] == 1 else "0%")
        
        layout["metrics"].update(Panel(matrix, border_style="magenta"))

        # 3. ASCII Radar Pattern (Simulated Constellation)
        # Extract cleanly from the dictionary now that skill_store handles JSON.
        causal_signal = latest['gap_vector'].get('causal', 0) if isinstance(latest['gap_vector'], dict) else 0
        synthesis_val = latest['synthesis_bridges']
        
        radar_text = f"      [bold cyan]Minto {latest['minto_adherence']*100:.0f}%[/bold cyan]\n        /           \\\n [bold]Causal[/bold]   *      [bold]Synthesis[/bold]\n  {causal_signal}            {synthesis_val}\n        \\           /\n      [bold yellow]ROT (Pending)[/bold yellow]"
        layout["constellation"].update(Panel(Align.center(radar_text), title="Core Constellation", border_style="cyan"))

        # 4. Timeline (Sparklines)
        timeline_table = Table(box=None, padding=(0, 2))
        minto_history = self.df['minto_adherence'].values[-20:].tolist()
        
        timeline_table.add_row(
            "Minto Trend", ascii_sparkline(minto_history)
        )
        
        layout["footer"].update(Panel(timeline_table, title="Predictive Timeline", border_style="white"))

        console.print(layout)

if __name__ == "__main__":
    store = SkillStore()
    df = store.load_features()
    ObservatoryDashboard(df).render()

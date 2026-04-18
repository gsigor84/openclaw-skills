import argparse
import sys
import pandas as pd
from skill_store import SkillStore
from stats_engine import StatsEngine
from rich_dashboard import ObservatoryDashboard
from agents import ObservatoryAgents
from rich.console import Console

console = Console()

def main():
    parser = argparse.ArgumentParser(description="Tutor Observatory V2.0: Pure Python Intelligence Engine")
    parser.add_argument("--live", action="store_true", help="Realtime radar + pulse")
    parser.add_argument("--stats", action="store_true", help="High-fidelity analytics matrix")
    parser.add_argument("--forecast", action="store_true", help="Stats predictions + drills")
    parser.add_argument("--sync", action="store_true", help="Sync raw logs to feature store")
    parser.add_argument("--export", choices=["csv", "json"], help="Export feature store to file")
    
    args = parser.parse_args()

    # 1. Initialize Stack
    store = SkillStore()
    
    if args.sync or len(sys.argv) == 1:
        count = store.sync_logs()
        if args.sync:
            console.print(f"[green]✓ Synced {count} sessions to feature store.[/green]")

    df = store.load_features()
    if df.empty:
        console.print("[red]Error: Feature store is empty. Run --sync first.[/red]")
        return

    # 2. Routing
    if args.export == "csv":
        df.to_csv("observatory_export.csv", index=False)
        console.print("[green]✓ Exported to observatory_export.csv[/green]")
    elif args.forecast:
        engine = StatsEngine(df)
        slope, r = engine.get_velocity_trend()
        console.print(f"\n[bold cyan]PROGESSION FORECAST[/bold cyan]")
        console.print(f"Velocity: {slope:.3f}/session (Confidence: {r*100:.1f}%)")
        console.print(f"Plateau Risk: {'[red]HIGH[/red]' if engine.detect_plateau() else '[green]LOW[/green]'}")
    else:
        # Default: Full Dashboard + Alerts
        dashboard = ObservatoryDashboard(df)
        dashboard.render()
        
        # Run Agents
        agents = ObservatoryAgents(df)
        alerts = agents.run_all()
        if alerts:
            console.print("\n[bold yellow]INTELLIGENCE ALERTS:[/bold yellow]")
            for a in alerts:
                console.print(f"[{a['agent']}] {a['status']}: {a['message']}")

if __name__ == "__main__":
    main()

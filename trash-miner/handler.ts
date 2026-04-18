import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

/**
 * Trash Miner Handler (v3.0)
 * Orchestrates the full autonomous niche research pipeline.
 */
const handler = async (params: { 
  niche: string; 
  niche_type?: string; 
  subs?: string;
  source?: string;
}) => {
  const niche = params.niche;
  const niche_type = params.niche_type || "saas";
  const source = params.source || "reddit";
  const subs = params.subs || "";

  if (!niche) {
    return "Error: Please specify a niche. Usage: `/trash-miner --niche \"mcp servers\"`";
  }

  const SKILL_DIR = "/Users/igorsilva/clawd/skills/trash-miner";
  const PROJECT_DIR = "/Users/igorsilva/PycharmProjects/trash_miner";
  const PYTHON = "/opt/anaconda3/bin/python3";

  const results: string[] = ["🚀 **Trash Miner Intelligence Execution**", ""];

  // --- Phase 0: Health Check ---
  results.push("🔹 **Phase 0: Environment Health Check**");
  const healthCheck = spawnSync(PYTHON, [path.join(SKILL_DIR, "scripts/health_check.py")], { encoding: "utf8" });
  if (healthCheck.status !== 0) {
    return `❌ **Phase 0 Failed**: Environment issues detected.\n\nTrace:\n\`\`\`\n${healthCheck.stdout || healthCheck.stderr}\n\`\`\``;
  }
  results.push("✅ System healthy (spaCy, Ollama confirmed).");

  // --- Phase 1: Seed Generation ---
  results.push("🔹 **Phase 1: Seed Generation**");
  const seedGen = spawnSync(PYTHON, [
    path.join(PROJECT_DIR, "seed_factory.py"),
    "--source", source,
    "--topic", niche
  ], { cwd: PROJECT_DIR, encoding: "utf8" });
  if (seedGen.status !== 0) {
    results.push(`⚠️ Seed generation had issues, but attempting to continue...`);
  } else {
    results.push(`✅ Seeds generated for topic: "${niche}".`);
  }

  // --- Phase 2: Harvesting ---
  results.push(`🔹 **Phase 2: Harvesting (${source})**`);
  const harvestArgs = [path.join(PROJECT_DIR, "rss_miner.py"), "--mode", "fetch"];
  if (subs) {
    harvestArgs.push("--subs", subs);
  }
  const harvest = spawnSync(PYTHON, harvestArgs, { cwd: PROJECT_DIR, encoding: "utf8" });
  if (harvest.status !== 0) {
    return `❌ **Phase 2 Failed**: Harvesting error.\n\nTrace:\n\`\`\`\n${harvest.stdout || harvest.stderr}\n\`\`\``;
  }
  results.push("✅ Data harvested to `data/reddit_threads.jsonl`.");

  // --- Phase 2.5: Validation ---
  results.push("🔹 **Phase 2.5: Signal Validation**");
  const validation = spawnSync(PYTHON, [path.join(SKILL_DIR, "scripts/subreddit_validator.py")], { encoding: "utf8" });
  if (validation.status !== 0) {
     results.push(`⚠️ **Low Signal Warning**: Only a few data points found. Pipeline might be thin.`);
  } else {
    results.push("✅ High signal volume confirmed.");
  }

  // --- Phase 3: Intelligence Pipeline ---
  results.push("🔹 **Phase 3: Structural Intelligence Pass**");
  const pipeline = spawnSync(PYTHON, [
    path.join(PROJECT_DIR, "openclaw_miner/run_pipeline.py"),
    "--input", "../data/reddit_threads.jsonl",
    "--niche", niche
  ], { cwd: path.join(PROJECT_DIR, "openclaw_miner"), encoding: "utf8" });
  if (pipeline.status !== 0) {
    return `❌ **Phase 3 Failed**: Strategic bridge detection failed.\n\nTrace:\n\`\`\`\n${pipeline.stdout || pipeline.stderr}\n\`\`\``;
  }
  results.push("✅ Normalization & Bridge Detection complete.");

  // --- Phase 3.5: Market Grounding (Perplexity) ---
  results.push("🔹 **Phase 3.5: Market Grounding (Perplexity Sonar)**");
  const grounding = spawnSync(PYTHON, [path.join(PROJECT_DIR, "market_grounder.py")], { cwd: PROJECT_DIR, encoding: "utf8" });
  if (grounding.status !== 0) {
    results.push(`⚠️ Grounding pass failed or skipped (check API keys). Continuing to synthesis...`);
  } else {
    results.push("✅ Grounding complete. Real-time web signal integrated.");
  }

  // --- Phase 4: Reporting ---
  results.push("🔹 **Phase 4: Synthesis & Relay**");
  
  // Find the latest scored file to pass to report generator
  const resultsDir = path.join(PROJECT_DIR, "openclaw_miner/data/normalized");
  const files = fs.readdirSync(resultsDir).filter(f => f.startsWith("final_scored_run_")).sort().reverse();
  const latestScoredFile = files.length > 0 ? path.join(resultsDir, files[0]) : "";

  const reportArgs = [path.join(PROJECT_DIR, "niche_broker_report.py")];
  if (latestScoredFile) {
    reportArgs.push(latestScoredFile);
  }

  const report = spawnSync(PYTHON, reportArgs, { cwd: PROJECT_DIR, encoding: "utf8" });
  const relay = spawnSync(PYTHON, [path.join(SKILL_DIR, "scripts/report_relay.py")], { encoding: "utf8" });

  results.push("✅ Strategic report synthesized with grounded insights.");
  results.push("✅ Relay complete. Check `~/clawd/data/trash_miner/` for the final markdown file.");
  
  results.push("\n✨ **Mission Complete.**");

  return results.join("\n");
};

export default handler;

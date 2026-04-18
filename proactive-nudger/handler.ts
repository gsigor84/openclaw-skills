import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import YAML from "yaml";

const CONFIG_PATH = "/Users/igorsilva/.openclaw/skills/proactive-nudger/assets/sentinel-config.yaml";

/**
 * Proactive Nudger Handler (V2.1)
 * Monitors the habit ledger and dispatches conversations nudges via WhatsApp.
 */
const handler = async (params: { subcommand?: string }) => {
  const subcommand = params.subcommand || "status";

  // 0. Load Configuration from Assets
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Critical Error: Configuration file missing at ${CONFIG_PATH}`);
  }
  const config = YAML.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  
  const LEDGER_PATH = config.sentinel.ledger_path;
  const SKILLS_ROOT = config.sentinel.skills_root;
  const WHATSAPP_TARGET = config.messaging.target_number;
  const GATEWAY_TOKEN = config.messaging.gateway_token;

  // 1. Gather all "Proactive" skills and their intervals
  const proactiveSkills: Record<string, { intervalMs: number; lastUsed?: string }> = {};
  
  const skillDirs = fs.readdirSync(SKILLS_ROOT);
  for (const dir of skillDirs) {
    const skillMdPath = path.join(SKILLS_ROOT, dir, "SKILL.md");
    if (!fs.existsSync(skillMdPath)) continue;
    
    const content = fs.readFileSync(skillMdPath, "utf8");
    const metaMatch = content.match(/metadata:\s*(\{[\s\S]*?\})/);
    if (!metaMatch) continue;
    
    try {
      const meta = JSON.parse(metaMatch[1]);
      if (meta.proactive) {
        // Parse interval (e.g., "2d", "12h")
        const intervalStr = meta.nudge_interval || config.monitoring.default_interval;
        const num = parseInt(intervalStr);
        const unit = intervalStr.slice(-1).toLowerCase();
        let ms = num * 24 * 60 * 60 * 1000; // Default 2d
        if (unit === "h") ms = num * 60 * 60 * 1000;
        if (unit === "m") ms = num * 60 * 1000;
        if (unit === "w") ms = num * 7 * 24 * 60 * 60 * 1000;
        
        proactiveSkills[dir] = { intervalMs: ms };
      }
    } catch (err) {
      // Gracefully skip unparseable metadata
    }
  }

  if (Object.keys(proactiveSkills).length === 0) {
    return "No skills are currently tagged with `proactive: true`. Accountability is dormant.";
  }

  // 2. Read Ledger to find last used timestamps (supports both 'command' and 'skill' keys)
  if (fs.existsSync(LEDGER_PATH)) {
    const lines = fs.readFileSync(LEDGER_PATH, "utf8").split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const identity = entry.skill || entry.command;
        if (!identity) continue;

        // Match identity to skill directory
        for (const skillDir in proactiveSkills) {
          if (identity === skillDir || identity.includes(skillDir) || skillDir.includes(identity)) {
            proactiveSkills[skillDir].lastUsed = entry.timestamp;
          }
        }
      } catch { continue; }
    }
  }

  const now = Date.now();
  const drifts: any[] = [];
  
  for (const skillId in proactiveSkills) {
    const data = proactiveSkills[skillId];
    
    // Fix: If lastUsed is missing, don't default to 0 (Epoch 1970).
    // We treat never-used skills as non-drifting to prevent the "56-year drift" false positive.
    if (!data.lastUsed) {
      drifts.push({
        skillId,
        hoursSince: null, // Sentinel value for "Never used"
        intervalHours: Math.round(data.intervalMs / (1000 * 60 * 60)),
        isDrifting: false
      });
      continue;
    }

    const lastUsedMs = new Date(data.lastUsed).getTime();
    const driftMs = now - lastUsedMs;
    const hoursSince = Math.round(driftMs / (1000 * 60 * 60));
    
    drifts.push({
      skillId,
      hoursSince,
      intervalHours: Math.round(data.intervalMs / (1000 * 60 * 60)),
      isDrifting: driftMs > data.intervalMs
    });
  }

  // 3. Command Logic
  if (subcommand === "status") {
    const report = drifts.map(d => {
      const icon = d.isDrifting ? "⚠️" : "🟢";
      const sinceText = d.hoursSince === null ? "Never used" : `${d.hoursSince}h ago`;
      return `${icon} **${d.skillId}**: Last used ${sinceText} (Threshold: ${d.intervalHours}h)`;
    });
    return [
      "📈 **Accountability Dashboard**",
      "",
      ...report,
      "",
      `Ledger: \`${LEDGER_PATH}\``
    ].join("\n");
  }

  if (subcommand === "trigger-next") {
    const target = drifts.find(d => d.isDrifting);
    if (!target) return "All proactive habits are within their thresholds. Good work.";

    // Dispatches a "Nudge" via WhatsApp (Simulated via OpenClaw Message Tool)
    const nudge = `Hey Igor, I noticed you haven't used the /${target.skillId} in ${target.hoursSince}h. Shall we carve out 20 minutes for a quick session today?`;
    
    const res = spawnSync("/Users/igorsilva/.nvm/versions/node/v22.16.0/bin/node", [
      "/Users/igorsilva/.nvm/versions/node/v22.16.0/bin/openclaw",
      "message", "send",
      "--target", WHATSAPP_TARGET,
      "--message", nudge
    ], { encoding: "utf8", env: { ...process.env, OPENCLAW_GATEWAY_TOKEN: GATEWAY_TOKEN } });

    if (res.status === 0) {
      return `Nudge dispatched for ${target.skillId}: "${nudge}"`;
    } else {
      return `ERROR: Nudge delivery failed for ${target.skillId}. Gateway may be down. Trace: ${res.stdout || res.stderr}`;
    }
  }

  return "ERROR: Invalid subcommand. Use `status` or `trigger-next`.";
};

export default handler;
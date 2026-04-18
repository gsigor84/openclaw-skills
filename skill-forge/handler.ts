import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

/**
 * Skill Forge Handler (v1.0)
 * The Meta-Orchestrator for OpenClaw.
 */
const handler = async (params: { 
  niche: string; 
  goal?: string; 
  creative?: boolean;
}) => {
  const niche = params.niche;
  const goal = params.goal || "Autonomous skill for specialized niche research.";
  
  if (!niche) {
    return "❌ Error: Please specify a niche name. Usage: `/skill-forge --niche \"mcp-context\"`";
  }

  // 1. Normalization (Kebab-case)
  const skillId = niche.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const BASE_DIR = "/Users/igorsilva/clawd/skills";
  const TARGET_DIR = path.join(BASE_DIR, skillId);
  const FORGE_DIR = "/Users/igorsilva/clawd/skills/skill-forge";

  const results: string[] = [`🚀 **Forging Skill: ${skillId}**`, ""];

  // 2. Structural Scaffolding
  if (fs.existsSync(TARGET_DIR)) {
    return `⚠️ Error: Skill directory already exists at ${TARGET_DIR}. Please choose a unique name or delete the existing one.`;
  }

  results.push(`🔹 Creating directory structure at ${TARGET_DIR}...`);
  const folders = ["references", "scripts", "assets"];
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  folders.forEach(f => fs.mkdirSync(path.join(TARGET_DIR, f)));
  results.push("✅ Base folders created.");

  // 3. Template Injection (SKILL.md)
  results.push("🔹 Generating SKILL.md from template...");
  const skillTemplate = fs.readFileSync(path.join(FORGE_DIR, "references/template_SKILL.md"), "utf8");
  const skillMd = skillTemplate
    .replace(/{{name}}/g, skillId)
    .replace(/{{description}}/g, goal)
    .replace(/{{goal}}/g, goal);
  
  fs.writeFileSync(path.join(TARGET_DIR, "SKILL.md"), skillMd);
  results.push("✅ SKILL.md initialized.");

  // 4. Template Injection (handler.ts)
  results.push("🔹 Scaffolding handler.ts...");
  const handlerTemplate = fs.readFileSync(path.join(FORGE_DIR, "references/template_handler.ts"), "utf8");
  const handlerTs = handlerTemplate.replace(/{{name}}/g, skillId);
  
  fs.writeFileSync(path.join(TARGET_DIR, "handler.ts"), handlerTs);
  results.push("✅ handler.ts initialized.");

  // 5. Registration Script execution
  results.push("🔹 Registering with OpenClaw system...");
  const regScript = path.join(FORGE_DIR, "scripts/register_skill.sh");
  if (fs.existsSync(regScript)) {
     const reg = spawnSync("bash", [regScript, skillId], { encoding: "utf8" });
     if (reg.status === 0) {
       results.push("✅ Physical registration complete.");
     } else {
       results.push("⚠️ Registration warning: Could not auto-register. Manual registration required.");
     }
  }

  results.push(`\n✨ **Skill Forge Complete.**`);
  results.push(`Next step: Build your logic in ` + path.join(TARGET_DIR, "handler.ts"));

  return results.join("\n");
};

export default handler;

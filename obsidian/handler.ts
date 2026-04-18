import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

/**
 * Obsidian Convergence Engine (v10.0)
 * Finalized bidirectional sync between Agent Context and User Vault.
 */
const handler = async (params: { 
  method: string;
  args: any;
}) => {
  const VAULT_ROOT = "/Users/igorsilva/Library/Mobile Documents/iCloud~md~obsidian/Documents/openclaw";
  const WS_ROOT = "/Users/igorsilva/.openclaw/workspace";
  
  const { method, args } = params;

  // --- Helper: Structural Enforcement ---
  const ensureStructure = () => {
    const folders = ["00_memories", "01_soul", "02_agent", "03_skills", "04_memory_graph"];
    folders.forEach(f => {
      const p = path.join(VAULT_ROOT, f);
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });
  };

  const getLogicalFolder = (title: string, content: string, tags: string[] = []) => {
    const text = (title + " " + (content || "") + " " + (tags || []).join(" ")).toLowerCase();
    if (text.includes("soul") || text.includes("identity") || text.includes("values")) return "01_soul";
    if (text.includes("agent") || text.includes("system") || text.includes("rules")) return "02_agent";
    if (text.includes("skill") || text.includes("workflow") || text.includes("how-to")) return "03_skills";
    if (text.includes("graph") || text.includes("link") || text.includes("connect")) return "04_memory_graph";
    return "00_memories";
  };

  const validatePaths = (filePath: string) => {
    const relativePart = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const obsidianAbs = path.resolve(VAULT_ROOT, relativePart);
    const workspaceAbs = path.resolve(WS_ROOT, path.basename(relativePart));

    if (!obsidianAbs.startsWith(VAULT_ROOT)) {
      throw new Error(`🚫 Security Violation: Path '${filePath}' is outside the authorized vault.`);
    }
    return { obsidianAbs, workspaceAbs, relative: relativePart };
  };

  // --- Helper: Perfect Bidirectional Mirroring ---
  const writeConvergence = (paths: { obsidianAbs: string, workspaceAbs: string }, content: string) => {
    const status = { vault: false, workspace: false, error: "" };
    ensureStructure();

    // 1. Mandatory Vault Write
    try {
      const dir = path.dirname(paths.obsidianAbs);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(paths.obsidianAbs, content, "utf8");
      status.vault = true;
    } catch (e: any) { throw new Error(`Vault Write Error: ${e.message}`); }

    // 2. Identity Mirroring (Critical for Convergence)
    const coreIdentity = ["SOUL.md", "IDENTITY.md", "MEMORY.md", "PHILOSOPHY.md", "AGENTS.md", "BOOT.md"];
    if (coreIdentity.includes(path.basename(paths.obsidianAbs))) {
      try {
        fs.writeFileSync(paths.workspaceAbs, content, "utf8");
        status.workspace = true;
      } catch (e: any) { status.error = `Mirroring failed: ${e.message}`; }
    }

    return status;
  };

  const updateFrontmatter = (content: string, title?: string, tags?: string[]) => {
    const now = new Date().toISOString();
    const fmData: Record<string, any> = {
      updated: now,
      created: now,
      version: "v10.0 (Convergence)",
      source: "openclaw-agent"
    };
    if (title) fmData.title = `"${title}"`;
    if (tags && tags.length) fmData.tags = `[${tags.map(t => `"${t}"`).join(", ")}]`;

    const newFm = "---\n" + Object.entries(fmData).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n---\n\n";
    let body = content;
    if (title && !body.includes(`# ${title}`)) body = `# ${title}\n\n` + body;
    return newFm + body;
  };

  const results: string[] = [`🔱 **Obsidian Convergence v10.0: ${method.toUpperCase()}**`, ""];

  try {
    switch (method) {
      case "list_obsidian_notes": {
        const paths = validatePaths(args.folder || ".");
        results.push(`📂 Listing [Convergence Root]: /${args.folder || ""}`);
        if (!fs.existsSync(paths.obsidianAbs)) {
          results.push(`⚠️ Folder not found. Run a write to auto-provision.`);
          break;
        }
        const entries = fs.readdirSync(paths.obsidianAbs, { withFileTypes: true });
        entries.filter(e => !e.name.startsWith(".")).slice(0, 20).forEach(e => results.push(`- ${e.name}${e.isDirectory() ? "/" : ""}`));
        break;
      }

      case "search_obsidian": {
        const paths = validatePaths(args.folder || ".");
        const search = spawnSync("grep", ["-ril", args.query, paths.obsidianAbs], { encoding: "utf8" });
        if (search.status === 0 && search.stdout) {
          search.stdout.trim().split("\n").map(f => path.relative(VAULT_ROOT, f)).slice(0, 10).forEach(f => results.push(`- [[${f}]]`));
        } else { results.push(`⚠️ No matches found.`); }
        break;
      }

      case "read_obsidian_note": {
        const paths = validatePaths(args.filename);
        if (!fs.existsSync(paths.obsidianAbs)) throw new Error(`File not found.`);
        results.push(`📖 Reading (v10.0): \`${args.filename}\``);
        results.push("\n```markdown\n" + fs.readFileSync(paths.obsidianAbs, "utf8") + "\n```");
        break;
      }

      case "create_obsidian_note": {
        const { title, tags, content } = args;
        const targetFolder = args.folder || getLogicalFolder(title, content || "", tags || []);
        const paths = validatePaths(path.join(targetFolder, `${title}.md`));
        if (fs.existsSync(paths.obsidianAbs)) throw new Error(`Note already exists.`);
        const status = writeConvergence(paths, updateFrontmatter(content || "", title, tags));
        results.push(`📝 Created: \`${paths.relative}\``);
        if (status.workspace) results.push(`🧠 Context Converged.`);
        break;
      }

      case "sync_skill_catalog": {
        results.push(`🔄 **Initializing v11.0 Skill Catalog Sync...**`);
        const sync = spawnSync("bash", ["/Users/igorsilva/clawd/skills/obsidian/scripts/sync_skills.sh"], { encoding: "utf8" });
        if (sync.status === 0) {
          results.push(sync.stdout);
          results.push(`✅ **Catalog Sync Complete.** Check your 03_skills folder in Obsidian.`);
        } else {
          results.push(`❌ **Sync Failed**: ${sync.stderr}`);
        }
        break;
      }

      default:
        return `❌ Error: Unknown method '${method}'.`;
    }
  } catch (error: any) { return `❌ **Convergence Error**: ${error.message}`; }
  return results.join("\n");
};

export default handler;

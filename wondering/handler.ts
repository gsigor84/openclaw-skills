import fs from "node:fs";
import path from "node:path";

const STATE_ROOT = "/Users/igorsilva/.openclaw/workspace/state/.wondering/";

/**
 * Wondering Sentinel Handler
 * Reads the latest behavioral observations and reports patterns/status.
 */
const handler = async (params: { subcommand?: string }) => {
  const subcommand = params.subcommand || "status";

  // Identify the latest observation file
  if (!fs.existsSync(STATE_ROOT)) {
    return `ERROR: State root missing: ${STATE_ROOT}. The sentinel has no memory.`;
  }

  const files = fs.readdirSync(STATE_ROOT)
    .filter(f => f.startsWith("observation-") && f.endsWith(".md"))
    .sort()
    .reverse();

  if (files.length === 0) {
    return "ERROR: No observations found in the workspace state. The system has been silent.";
  }

  const latestFile = path.join(STATE_ROOT, files[0]);
  const content = fs.readFileSync(latestFile, "utf8");

  // Basic Parsing for /wondering status
  if (subcommand === "status") {
    const summaryMatch = content.match(/## Patterns([\s\S]*?)## Decision/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "No detailed patterns extracted in this cycle.";
    const cronErrorsMatch = content.match(/## Cron Errors([\s\S]*?)##/);
    const cronErrors = cronErrorsMatch ? cronErrorsMatch[1].trim() : "Cron health check missing.";

    return [
      "👁️ **Wondering Sentinel | Latest Status**",
      `Source: \`${files[0]}\``,
      "",
      "### Cron Job Health",
      cronErrors,
      "",
      "### Strategic Observations",
      summary,
      "",
      "---",
      "_To see individual behavioral trends, use `/wondering patterns`_"
    ].join("\n");
  }

  // Basic Parsing for /wondering patterns
  if (subcommand === "patterns") {
    const patternsMatch = content.match(/## Patterns([\s\S]*?)## Decision/);
    const patterns = patternsMatch ? patternsMatch[1].trim() : "No patterns recorded.";

    return [
      "📈 **Wondering Sentinel | Behavioral Patterns**",
      `Source: \`${files[0]}\``,
      "",
      patterns,
      "",
      "---",
      "**Action Recommendation:** Fix the WhatsApp delivery layer to restore the autonomous pulse."
    ].join("\n");
  }

  return `ERROR: Invalid subcommand. Use \`status\` or \`patterns\`.`;
};

export default handler;

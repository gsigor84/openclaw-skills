/**
 * Exec Guard — Pre-flight Validation Module
 * Standardized for the OpenClaw Elite Environment.
 */

import { execSync } from "node:child_process";
import { existsSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LOG_FILE = "/Users/igorsilva/.openclaw/workspace/log/exec-incidents.log";

// Ensure log directory exists
try {
  mkdirSync(dirname(LOG_FILE), { recursive: true });
} catch (e) {
  // Directory might exist or be inaccessible
}

export interface ExecValidation {
  valid: boolean;
  command: string;
  incidents: string[];
  fixes: string[];
}

/**
 * Validate a single exec command before running.
 * Checks for binary presence, file state, and gateway health.
 */
export function validateExec(command: string): ExecValidation {
  const incidents: string[] = [];
  const fixes: string[] = [];

  // Match: python3 script.py OR node script.js OR bash script.sh
  const match = command.match(/^(python3|python|node|bash|sh)\s+(.+)/i);
  if (!match) {
    // Non-script commands (like ls, mkdir) only check Gateway health
    checkGateway(incidents, fixes);
    return { valid: incidents.length === 0, command, incidents, fixes };
  }

  const [, interpreter, script] = match;
  const scriptPath = script.split(/\s+/)[0].replace(/^["'`]|^["'`]$/g, "");

  // 1. Check interpreter exists
  try {
    execSync(`command -v ${interpreter}`, { stdio: "ignore", timeout: 2000 });
  } catch {
    incidents.push(`❌ ${interpreter} not in PATH`);
    fixes.push(`🔧 Verify environment or install ${interpreter}`);
  }

  // 2. Check script file exists (if absolute path given)
  if (scriptPath.startsWith("/") && !existsSync(scriptPath)) {
    incidents.push(`❌ Script missing: ${scriptPath}`);
    fixes.push(`🔧 Double-check absolute path or recreate file`);
  }

  // 3. Check gateway health (Port 18789)
  checkGateway(incidents, fixes);

  const valid = incidents.length === 0;

  // 4. Log incidents to workspace
  if (!valid) {
    const entry =
      `\n[${new Date().toISOString()}] ${command}\n` +
      `Incidents:\n${incidents.join("\n")}\n` +
      `Fixes:\n${fixes.join("\n")}\n` +
      `---\n`;
    try {
      appendFileSync(LOG_FILE, entry);
    } catch (e) {
      console.error(`🛡️ Could not write to log file: ${LOG_FILE}`);
    }
  }

  return { valid, command, incidents, fixes };
}

function checkGateway(incidents: string[], fixes: string[]) {
  try {
    execSync(
      `curl -s -f http://127.0.0.1:18789/health || exit 1`,
      { stdio: "ignore", timeout: 2000 }
    );
  } catch {
    incidents.push("❌ Gateway (Port 18789) is non-responsive");
    fixes.push("🔧 Manual Action Required: Restart the OpenClaw gateway app.");
  }
}

/**
 * CLI Entry point
 */
const cmd = process.argv[2];
if (cmd) {
  const result = validateExec(cmd);
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  process.exit(result.valid ? 0 : 1);
}

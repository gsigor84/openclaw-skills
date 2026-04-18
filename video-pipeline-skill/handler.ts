import { spawn } from "node:child_process";

const PIPELINE_PY = "/Users/igorsilva/clawd/tools/video_pipeline_runner.py";
const PIPELINE_TIMEOUT_MS = 90000;

function tryParseBalancedObject(text: string, start: number) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        return JSON.parse(candidate);
      }
    }
  }
  return null;
}

function extractJsonObject(stdout: string) {
  const starts: number[] = [];
  for (let i = 0; i < stdout.length; i++) if (stdout[i] === "{") starts.push(i);
  for (let i = starts.length - 1; i >= 0; i--) {
    try {
      const parsed = tryParseBalancedObject(stdout, starts[i]);
      if (parsed && typeof parsed === "object" && ((parsed as any).prompt || (parsed as any).scenes)) return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

function formatReplyFromRunner(stdout: string) {
  const parsed = extractJsonObject(stdout);
  if (!parsed || typeof parsed !== "object") return null;
  const scenes = Array.isArray((parsed as any).scenes) ? (parsed as any).scenes : [];
  const prompt = typeof (parsed as any).prompt === "string" ? (parsed as any).prompt.trim() : "";
  if (!scenes.length && !prompt) return null;
  const lines: string[] = ["🎬 Video Pipeline Results:", ""];
  lines.push("---", "### Scenes", "");
  for (let i = 0; i < scenes.length; i++) {
    lines.push(`**${i + 1}.** ${String(scenes[i]).trim()}`, "");
  }
  lines.push("---", "### Final Prompt (Copy to Luma/Runway)", "");
  lines.push("```text", prompt || "ERROR: runner returned no final prompt", "```");
  return lines.join("\n").trim();
}

/**
 * Universal Video Pipeline Skill Handler
 * Responds to /video-pipeline in the Webchat and dispatches to the production runner.
 */
const handler = async (params: { concept: string }) => {
  const concept = params.concept;
  if (!concept) return "ERROR: No concept provided to /video-pipeline. Please provide a creative idea.";

  const result = await new Promise<{ code: number | null; stdout: string; stderr: string; spawnError?: string; timedOut?: boolean }>((resolve) => {
    const child = spawn("python3", [PIPELINE_PY, concept], {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      resolve({ code: null, stdout, stderr, timedOut: true });
    }, PIPELINE_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code: null, stdout, stderr, spawnError: String(err) });
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });

  if (result.timedOut) {
    return `ERROR: Video pipeline timed out after ${PIPELINE_TIMEOUT_MS / 1000}s. The creative engine is taking too long upstream.`;
  }

  const formatted = formatReplyFromRunner(result.stdout || "");
  if (formatted) return formatted;

  const output = (result.stdout || result.stderr || result.spawnError || "").trim();
  if (output) return output;
  if (result.code !== 0) return `ERROR: Video pipeline exited with code ${result.code}. Check the logs for infrastructure drift.`;
  return "ERROR: Video pipeline returned no output. Verify your Python environment.";
};

export default handler;

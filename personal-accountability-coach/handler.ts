import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

/**
 * personal-accountability-coach Handler (v1.0)
 * Built from research corpus via Skill Forge Phase 2
 */
const handler = async (params: {
  command?: string;
  message?: string;
}) => {
  const SKILL_DIR = path.dirname(__filename);
  const LOG_PATH = path.join(
    process.env.HOME || "/Users/igorsilva",
    ".openclaw/workspace/state/accountability-log.md"
  );

  const command = params.command || params.message || "checkback";
  const results: string[] = [];

  // ── Detect IQ language ──────────────────────────────────────────────────────────
  const iqPatterns = [
    /why is/i, /why does/i, /when will/i, /who dropped/i,
    /it's not my fault/i, /i have to/i, /i can't/i,
    /i need to think about it/i, /not the right time/i,
    /waiting for/i, /almost there/i, /just tell me what to do/i,
  ];
  const isIQ = (msg: string) => iqPatterns.some(p => p.test(msg));

  const qbqRedirect = (context: string) =>
    `That's an Incorrect Question. Try: "What can I do right now${context ? ` to ${context}` : "?"}"`;

  // ── Two-Minute Rule shrinker ─────────────────────────────────────────────────
  const twoMinuteShrink = (task: string): string => {
    const shrinks: [RegExp, string][] = [
      [/write an? .+/i, "open the editor and write one sentence"],
      [/publish/i, "mark it as draft-ready"],
      [/build/i, "write the first function"],
      [/research/i, "open one tab with the topic"],
      [/read/i, "open the book or article"],
      [/start/i, "do the first step"],
      [/call/i, "prepare the talking points"],
      [/send/i, "write the first sentence"],
      [/exercise/i, "tie your shoes"],
      [/run/i, "put on your running shoes"],
    ];
    for (const [pattern, replacement] of shrinks) {
      if (pattern.test(task)) return replacement;
    }
    return `do the first step of: ${task}`;
  };

  // ── Routing ───────────────────────────────────────────────────────────────────
  if (command.includes("checkback")) {
    results.push(
      "**Checkback** — What did you say you'd do?\n\n" +
      "1. Did you do it?\n" +
      "2. What got in the way?\n" +
      "3. What can you do in the next 30 minutes?\n\n" +
      "(Use `/accountability ship` if you have something to publish.)"
    );
  } else if (command.includes("ship")) {
    results.push(
      "**Ship Prompt**\n\n" +
      "What did you build this week that nobody has seen?\n" +
      "What's ready enough to share — not perfect, just public?\n\n" +
      "Name it. Who's the first person who should see it? By when?"
    );
  } else if (command.includes("stuck")) {
    results.push(
      "**Stuck Protocol**\n\n" +
      "You're avoiding something. Let's name it.\n\n" +
      "What's the specific task? And what's the voice in your head saying about it?\n\n" +
      "(If it's 'not ready' — apply the Two-Minute Rule: what's the first 2 minutes?)"
    );
  } else {
    // ── Advice Mode: classify the situation ─────────────────────────────────
    const msg = params.message || command;

    if (isIQ(msg)) {
      const matched = iqPatterns.find(p => p.test(msg));
      results.push(qbqRedirect("solve this"));
    } else if (/priority|focus|important/i.test(msg)) {
      results.push(
        "**Priority Check**\n\n" +
        "Law of Three — if you could do only one thing today that creates the most value, what is it?\n\n" +
        "Put it at the top of your list. Start it before anything else."
      );
    } else if (/not ready|perfect|polish|revision/i.test(msg)) {
      results.push(
        "**Ship Challenge**\n\n" +
        "Nothing is ever ready. That's the nature of work.\n\n" +
        "The question isn't 'is it ready?' It's: 'what's one thing I could share today?'\n\n" +
        "Two-Minute Rule: ${twoMinuteShrink(msg.split(" ")[0])}."
      );
    } else if (/can't|wont|impossible|hard/i.test(msg)) {
      results.push(
        "**Fixed-Mindset Flag**\n\n" +
        "That's the voice protecting you from risk.\n\n" +
        "Name it. Thank it. Then ask: 'What can I do right now to move forward?'"
      );
    } else {
      results.push(
        "**Accountability Check**\n\n" +
        "What's the specific next action? Not the whole task — the first step.\n" +
        "When and where will you do it?"
      );
    }
  }

  // Log the exchange
  const entry = `## ${new Date().toISOString().split("T")[0]}\n` +
    `- **Input:** ${(params.message || command).slice(0, 100)}\n` +
    `- **Response:** ${results.join(" ").slice(0, 200)}\n`;
  if (fs.existsSync(LOG_PATH)) {
    const current = fs.readFileSync(LOG_PATH, "utf8");
    fs.writeFileSync(LOG_PATH, current + "\n" + entry);
  }

  return results.join("\n");
};

export default handler;

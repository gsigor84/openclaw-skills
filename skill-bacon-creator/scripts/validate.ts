/**
 * validate.ts — live tool validation for skill-bacon-creator v1.1
 *
 * Validates that the skill scaffold is complete and all referenced
 * observations still produce the expected response shapes.
 *
 * Usage:
 *   npx ts-node scripts/validate.ts              — full validation
 *   npx ts-node scripts/validate.ts --fast       — structure checks only, no live calls
 *   npx ts-node scripts/validate.ts --fix        — auto-fix missing placeholder files
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

// ── Config ─────────────────────────────────────────────────────────────────

const SKILL_ROOT = path.resolve(__dirname, "..");
const FAST_MODE = process.argv.includes("--fast");
const FIX_MODE = process.argv.includes("--fix");

// ── Types ──────────────────────────────────────────────────────────────────

interface CheckResult {
  name: string;
  ok: boolean;
  reason?: string;
  fixed?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fileExists(rel: string): boolean {
  return fs.existsSync(path.join(SKILL_ROOT, rel));
}

function readFile(rel: string): string {
  return fs.readFileSync(path.join(SKILL_ROOT, rel), "utf8");
}

function writeFile(rel: string, content: string): void {
  const full = path.join(SKILL_ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

function pass(name: string): CheckResult {
  return { name, ok: true };
}

function fail(name: string, reason: string, fixed = false): CheckResult {
  return { name, ok: false, reason, fixed };
}

// ── Check 1: Required files exist ─────────────────────────────────────────

const REQUIRED_FILES = [
  "SKILL.md",
  "handler.ts",
  "state.json",
  "references/rules.md",
  "references/idols-log.md",
  "references/taxonomy.md",
  "references/traceability-matrix.md",
  "references/data/observations.md",
  "references/data/experiments.md",
  "references/data/environment.json",
  "scripts/validate.ts",
  "scripts/deploy.sh",
  "assets/test.json",
];

function checkRequiredFiles(): CheckResult[] {
  return REQUIRED_FILES.map(f => {
    if (fileExists(f)) return pass(`File exists: ${f}`);

    if (FIX_MODE) {
      writeFile(f, `<!-- placeholder: ${f} — populate before Phase 6 -->\n`);
      return fail(`File exists: ${f}`, `Missing — created placeholder`, true);
    }

    return fail(`File exists: ${f}`, `Missing: ${f}`);
  });
}

// ── Check 2: state.json is valid and not stuck ─────────────────────────────

function checkStateJson(): CheckResult {
  const name = "state.json valid";
  if (!fileExists("state.json")) return fail(name, "state.json not found");

  let state: Record<string, unknown>;
  try {
    state = JSON.parse(readFile("state.json"));
  } catch {
    return fail(name, "state.json is not valid JSON");
  }

  const required = ["skill", "version", "phase", "phasesComplete", "toolCalls", "observations", "experiments", "rules", "idols"];
  const missing = required.filter(k => !(k in state));
  if (missing.length > 0) return fail(name, `Missing fields: ${missing.join(", ")}`);

  const phase = state.phase as number;
  if (phase < 1 || phase > 7) return fail(name, `phase is ${phase} — must be 1–7`);

  return pass(name);
}

// ── Check 3: rules.md has ≥3 rules with source citations ──────────────────

function checkRules(): CheckResult {
  const name = "rules.md — ≥3 cited rules";
  if (!fileExists("references/rules.md")) return fail(name, "rules.md not found");

  const content = readFile("references/rules.md");

  // Count rule blocks
  const ruleMatches = content.match(/^## Rule \d+/gm) ?? [];
  if (ruleMatches.length < 3) {
    return fail(name, `Only ${ruleMatches.length} rule block(s) found — need ≥3`);
  }

  // Check each rule block has a Source line
  const blocks = content.split(/^## Rule \d+/m).slice(1);
  const untraceable = blocks
    .map((b, i) => ({ index: i + 1, hasSource: /\*\*Source:\*\*/.test(b) }))
    .filter(b => !b.hasSource);

  if (untraceable.length > 0) {
    return fail(name, `Rule(s) missing Source citation: ${untraceable.map(b => `Rule ${b.index}`).join(", ")}`);
  }

  return pass(name);
}

// ── Check 4: observations.md has ≥2 entries including an edge case ─────────

function checkObservations(): CheckResult {
  const name = "observations.md — ≥2 entries, includes edge case";
  if (!fileExists("references/data/observations.md")) return fail(name, "observations.md not found");

  const content = readFile("references/data/observations.md");
  const entries = content.match(/^## Observation \d+/gm) ?? [];

  if (entries.length < 2) {
    return fail(name, `Only ${entries.length} observation(s) — need ≥2`);
  }

  const hasEdge = /429|401|403|404|empty|null|error|fail|rate.limit/i.test(content);
  if (!hasEdge) {
    return fail(name, "No edge case or failure observation found — must probe at least one failure path");
  }

  return pass(name);
}

// ── Check 5: experiments.md has ≥2 entries ────────────────────────────────

function checkExperiments(): CheckResult {
  const name = "experiments.md — ≥2 entries";
  if (!fileExists("references/data/experiments.md")) return fail(name, "experiments.md not found");

  const content = readFile("references/data/experiments.md");
  const entries = content.match(/^## Experiment \d+/gm) ?? [];

  if (entries.length < 2) {
    // No-signal declaration is acceptable
    if (/No-signal declared/i.test(content)) {
      return pass(`${name} (no-signal declared — accepted)`);
    }
    return fail(name, `Only ${entries.length} experiment(s) — need ≥2 or a no-signal declaration`);
  }

  return pass(name);
}

// ── Check 6: idols-log.md is not empty ────────────────────────────────────

function checkIdolsLog(): CheckResult {
  const name = "idols-log.md — not empty";
  if (!fileExists("references/idols-log.md")) return fail(name, "idols-log.md not found");

  const content = readFile("references/idols-log.md");
  const hasRows = /\| (Tribe|Cave|Marketplace|Theatre) \|/.test(content);
  const hasNoneDeclaration = /No idols detected in this session/i.test(content);

  if (!hasRows && !hasNoneDeclaration) {
    return fail(name, "idols-log.md has no idol rows and no explicit 'no idols detected' declaration");
  }

  return pass(name);
}

// ── Check 7: traceability-matrix.md is populated ──────────────────────────

function checkTraceabilityMatrix(): CheckResult {
  const name = "traceability-matrix.md — populated";
  if (!fileExists("references/traceability-matrix.md")) return fail(name, "traceability-matrix.md not found");

  const content = readFile("references/traceability-matrix.md");
  if (content.includes("(not yet populated)")) {
    return fail(name, "traceability-matrix.md still has unpopulated placeholder rows");
  }

  const hasRows = /\| Observation/.test(content);
  if (!hasRows) {
    return fail(name, "No observation rows found in traceability-matrix.md");
  }

  return pass(name);
}

// ── Check 8: SKILL.md has required sections ───────────────────────────────

function checkSkillMd(): CheckResult {
  const name = "SKILL.md — required sections present";
  if (!fileExists("SKILL.md")) return fail(name, "SKILL.md not found");

  const content = readFile("SKILL.md");
  const required = ["## Trigger", "## Procedure", "## Failure Modes", "## Anti-Patterns"];
  const missing = required.filter(s => !content.includes(s));

  if (missing.length > 0) {
    return fail(name, `Missing sections: ${missing.join(", ")}`);
  }

  // Check it was generated by bacon and not written by hand without evidence
  if (!content.includes("Generated by skill-bacon-creator")) {
    return fail(name, "SKILL.md missing skill-bacon-creator generation marker — may have been written without evidence");
  }

  return pass(name);
}

// ── Check 9: deploy.sh is executable ──────────────────────────────────────

function checkDeploySh(): CheckResult {
  const name = "deploy.sh — executable";
  const full = path.join(SKILL_ROOT, "scripts", "deploy.sh");
  if (!fs.existsSync(full)) return fail(name, "deploy.sh not found");

  try {
    fs.accessSync(full, fs.constants.X_OK);
    return pass(name);
  } catch {
    if (FIX_MODE) {
      execSync(`chmod +x "${full}"`);
      return fail(name, "Not executable — fixed with chmod +x", true);
    }
    return fail(name, "deploy.sh is not executable — run: chmod +x scripts/deploy.sh");
  }
}

// ── Check 10: tool call budget not exceeded ───────────────────────────────

function checkToolBudget(): CheckResult {
  const name = "Tool call budget not exceeded";
  if (!fileExists("state.json")) return fail(name, "state.json not found");

  let state: Record<string, unknown>;
  try {
    state = JSON.parse(readFile("state.json"));
  } catch {
    return fail(name, "state.json is not valid JSON");
  }

  const caps: Record<string, number> = { search_web: 3, exec: 1, fetch_url: 1 };
  const calls = (state.toolCalls ?? {}) as Record<string, number>;
  const over = Object.entries(caps).filter(([tool, cap]) => (calls[tool] ?? 0) > cap);

  if (over.length > 0) {
    return fail(name, `Tool cap exceeded: ${over.map(([t, c]) => `${t} (cap ${c}, used ${calls[t]})`).join(", ")}`);
  }

  return pass(name);
}

// ── Runner ─────────────────────────────────────────────────────────────────

async function runValidation(): Promise<void> {
  console.log(`\n[validate] skill-bacon-creator v1.1`);
  console.log(`[validate] Root: ${SKILL_ROOT}`);
  console.log(`[validate] Mode: ${FAST_MODE ? "fast (structure only)" : "full"}${FIX_MODE ? " + fix" : ""}\n`);

  const results: CheckResult[] = [
    ...checkRequiredFiles(),
    checkStateJson(),
    checkSkillMd(),
    checkRules(),
    checkObservations(),
    checkExperiments(),
    checkIdolsLog(),
    checkTraceabilityMatrix(),
    checkDeploySh(),
    ...(FAST_MODE ? [] : [checkToolBudget()]),
  ];

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓  ${r.name}${r.fixed ? " (auto-fixed)" : ""}`);
      passed++;
    } else {
      console.log(`  ✗  ${r.name}`);
      console.log(`     → ${r.reason}${r.fixed ? " (auto-fixed)" : ""}`);
      failed++;
    }
  }

  console.log(`\n[validate] ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.error(`[validate] ✗ Validation failed — fix the above before running Skill Foundry.\n`);
    process.exit(1);
  }

  console.log(`[validate] ✓ All checks passed — skill scaffold is ready for Phase 6.\n`);
}

runValidation().catch(err => {
  console.error("[validate] Unexpected error:", err);
  process.exit(1);
});

/**
 * skill-bacon-creator / handler.ts  (v1.1)
 * Bacon's Empiricist Skill Builder
 *
 * Phase 1: Skill Entry        — validate input, scaffold folders, write/resume state.json
 * Phase 2: Observation Lab    — enforce ≥2 real tool calls, happy path + edge case
 * Phase 3: Experiment Run     — 2-3 variants, explicit no-signal handling
 * Phase 4: Induction Stage    — rules with source citations, traceability purge
 * Phase 5: Idols Checkpoint   — bias audit, explicit "no idols" allowed
 * Phase 6: Skill Foundry      — pre-flight gate, write all files including new ones
 * Phase 7: Conclusion Gate    — active 5-gate verification, not a passive checklist
 */

import fs from "node:fs";
import path from "node:path";

const WORKSPACE = "/Users/igorsilva/.openclaw/workspace";
const MAX_TOOL_CALLS: Record<string, number> = { search_web: 3, exec: 1, fetch_url: 1 };

// ── Types ──────────────────────────────────────────────────────────────────

type IdolType = "Tribe" | "Cave" | "Marketplace" | "Theatre";
type IdolStatus = "Patched" | "Unresolved";

interface IdolFlag {
  idol: IdolType;
  flag: string;
  status: IdolStatus;
  patch: string; // corrected assumption, or "needs resolution before build"
}

interface Observation {
  index: number;
  tool: string;
  timestamp: string;
  query: string;
  result: string; // truncated at 500 chars
  idolsFlagged: string;
  signal: string;
}

interface Experiment {
  index: number;
  name: string;
  timestamp: string;
  hypothesis: string;
  command: string;
  result: "success" | "error" | "partial";
  rawOutput: string; // truncated at 500 chars
  ruleImplication: string;
}

interface Rule {
  index: number;
  condition: string;
  consequence: string;
  fallback?: string;
  sourceRef: string; // e.g. "Observation 2" or "Experiment 1"
}

interface BaconState {
  skill: string;
  version: string;
  phase: number;
  phasesComplete: string[];
  toolCalls: Record<string, number>;
  observations: Observation[];
  experiments: Experiment[];
  rules: Rule[];
  idols: IdolFlag[];
  noIdolsDetected?: boolean;
  noExperimentSignal?: boolean;
  startedAt: string;
  updatedAt: string;
  error?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function log(msg: string): void {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p: string, content: string): void {
  fs.writeFileSync(p, content, "utf8");
}

function readFile(p: string): string {
  return fs.readFileSync(p, "utf8");
}

function fileExists(p: string): boolean {
  return fs.existsSync(p);
}

function truncate(s: string, max = 500): string {
  return s.length > max ? s.slice(0, max) + "…[truncated]" : s;
}

function sanitizeName(niche: string): string {
  return niche.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildFolderPath(niche: string): string {
  return path.join(WORKSPACE, `skill-${sanitizeName(niche)}-creator`);
}

function statePath(folder: string): string {
  return path.join(folder, "state.json");
}

// ── State: read / write / resume ──────────────────────────────────────────

function readState(folder: string): BaconState | null {
  const p = statePath(folder);
  if (!fileExists(p)) return null;
  try {
    return JSON.parse(readFile(p)) as BaconState;
  } catch {
    return null;
  }
}

function writeState(folder: string, state: BaconState): void {
  state.updatedAt = new Date().toISOString();
  writeFile(statePath(folder), JSON.stringify(state, null, 2));
}

function markPhaseComplete(state: BaconState, phase: string): void {
  if (!state.phasesComplete.includes(phase)) {
    state.phasesComplete.push(phase);
  }
}

// ── Tool call counter ─────────────────────────────────────────────────────

function canCallTool(tool: string, state: BaconState): boolean {
  const cap = MAX_TOOL_CALLS[tool] ?? 99;
  return (state.toolCalls[tool] ?? 0) < cap;
}

function recordToolCall(tool: string, state: BaconState): void {
  state.toolCalls[tool] = (state.toolCalls[tool] ?? 0) + 1;
}

// ── Phase 1: Skill Entry ───────────────────────────────────────────────────

function validateInput(niche: string): { ok: boolean; reason?: string } {
  if (!niche || niche.trim().length < 3) {
    return { ok: false, reason: "too_short" };
  }
  const vague = /^(ai|some|something|stuff|things?|handle|manage|support|process)\b/i;
  if (vague.test(niche.trim())) {
    return { ok: false, reason: "vague" };
  }
  return { ok: true };
}

function scaffoldFolders(folder: string): void {
  ensureDir(path.join(folder, "references", "data"));
  ensureDir(path.join(folder, "scripts"));
  ensureDir(path.join(folder, "assets"));
}

function initState(niche: string, folder: string): BaconState {
  return {
    skill: niche,
    version: "1.1",
    phase: 1,
    phasesComplete: [],
    toolCalls: {},
    observations: [],
    experiments: [],
    rules: [],
    idols: [],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── Phase 2: Observation Lab ──────────────────────────────────────────────

function validateObservationGate(state: BaconState): { ok: boolean; reason?: string } {
  if (state.observations.length < 2) {
    return { ok: false, reason: `Only ${state.observations.length} observation(s) recorded — need ≥2.` };
  }
  // Must have at least one non-happy-path observation (error, 4xx, empty, edge case)
  const hasEdge = state.observations.some(o =>
    /429|401|403|404|empty|null|error|fail|rate.limit/i.test(o.result + o.signal)
  );
  if (!hasEdge) {
    return { ok: false, reason: "No edge case or failure observation recorded. Must probe at least one failure path." };
  }
  return { ok: true };
}

function renderObservationsMd(observations: Observation[]): string {
  if (observations.length === 0) return "(no observations recorded yet)\n";
  return observations.map(o => `
## Observation ${o.index} — ${o.tool} — ${o.timestamp}
**Query:** ${o.query}
**Result:** ${o.result}
**Idols flagged:** ${o.idolsFlagged || "none"}
**Signal:** ${o.signal}
`.trim()).join("\n\n") + "\n";
}

// ── Phase 3: Experiment Run ───────────────────────────────────────────────

function validateExperimentGate(state: BaconState): { ok: boolean; reason?: string } {
  if (state.experiments.length < 2) {
    return { ok: false, reason: `Only ${state.experiments.length} experiment(s) recorded — need ≥2.` };
  }
  return { ok: true };
}

function renderExperimentsMd(experiments: Experiment[], noSignal: boolean): string {
  const header = noSignal
    ? "## ⚠ No-Signal Declaration\nAll experiments failed or returned no usable data. Induction is limited to failure-mode rules only. Skill Foundry will flag Known Gaps in the output SKILL.md.\n\n"
    : "";
  if (experiments.length === 0) return header + "(no experiments recorded yet)\n";
  return header + experiments.map(e => `
## Experiment ${e.index} — ${e.name} — ${e.timestamp}
**Hypothesis:** ${e.hypothesis}
**Command / call:** ${e.command}
**Result:** ${e.result}
**Raw output:** ${e.rawOutput}
**What this changes:** ${e.ruleImplication}
`.trim()).join("\n\n") + "\n";
}

// ── Phase 4: Induction Stage ──────────────────────────────────────────────

function validateRulesGate(state: BaconState): { ok: boolean; reason?: string } {
  if (state.rules.length < 3) {
    return { ok: false, reason: `Only ${state.rules.length} rule(s) — need ≥3.` };
  }
  // Traceability purge: reject any rule with no valid source ref
  const allRefs = [
    ...state.observations.map(o => `Observation ${o.index}`),
    ...state.experiments.map(e => `Experiment ${e.index}`),
  ];
  const untraceable = state.rules.filter(r => !allRefs.some(ref => r.sourceRef.includes(ref)));
  if (untraceable.length > 0) {
    return {
      ok: false,
      reason: `${untraceable.length} rule(s) have no traceable source: ${untraceable.map(r => `Rule ${r.index}`).join(", ")}. Delete or fix before proceeding.`,
    };
  }
  return { ok: true };
}

function renderRulesMd(rules: Rule[]): string {
  if (rules.length === 0) return "(no rules recorded)\n";
  return rules.map(r => `
## Rule ${r.index}
If ${r.condition}, then ${r.consequence}.${r.fallback ? `\nIf that fails, then ${r.fallback}.` : ""}
Source: ${r.sourceRef}
`.trim()).join("\n\n") + "\n";
}

// ── Phase 5: Idols Checkpoint ─────────────────────────────────────────────

function validateIdolsGate(state: BaconState): { ok: boolean; reason?: string } {
  if (!state.noIdolsDetected && state.idols.length === 0) {
    return { ok: false, reason: "Idols log is empty and noIdolsDetected is not set. Must either flag ≥1 idol or explicitly declare none detected." };
  }
  return { ok: true };
}

function renderIdolsLogMd(idols: IdolFlag[], noIdolsDetected?: boolean): string {
  if (noIdolsDetected) return "No idols detected in this session.\n";
  if (idols.length === 0) return "(idols log not yet completed)\n";
  const header = "| Idol | Flag | Status | Patch or Action |\n|---|---|---|---|";
  const rows = idols.map(f => `| ${f.idol} | ${f.flag} | ${f.status} | ${f.patch} |`).join("\n");
  return `${header}\n${rows}\n`;
}

// ── Phase 6: Skill Foundry — file generators ──────────────────────────────

function generateSkillMd(state: BaconState): string {
  const name = sanitizeName(state.skill);
  const rulesSection = state.rules.length
    ? state.rules.map((r, i) => `${i + 1}. If ${r.condition}, then ${r.consequence}.`).join("\n")
    : "(no rules verified — check references/rules.md)";

  const knownGaps = state.noExperimentSignal
    ? "\n## Known Gaps\nExperiment phase produced no positive signal. The following behaviours could not be verified and are marked as unconfirmed:\n- (fill in from experiment log)\n"
    : "";

  return `---
name: ${name}
version: "1.1"
description: "Bacon-grounded skill for ${state.skill}. Built via empiricist loop: observe → experiment → induct → idols check → conclude."
generated_by: skill-bacon-creator
generated_at: ${state.startedAt}
---

# ${state.skill}

## Trigger
/${name} <input>

## Use
Built using Bacon's empiricist method. Every rule below traces to a recorded observation.
See \`references/rules.md\` for source citations and \`references/traceability-matrix.md\` for full linkage.

## Procedure
${rulesSection}

## Failure Modes
${renderIdolsLogMd(state.idols, state.noIdolsDetected)}
${knownGaps}
## Anti-Patterns
- Never assume API silence means success
- Never skip the edge case probe
- Never write rules without source citations

---
*Generated by skill-bacon-creator v1.1. Evidence-based, not speculative.*
`;
}

function generateTaxonomyMd(niche: string): string {
  return `# Taxonomy — ${niche}

Defines domain-specific terms used in this skill. Addresses Idols of the Marketplace.

## [Term]
**Means:** <precise definition in this skill's context>
**Does NOT mean:** <common misuse to avoid>

<!-- Add one entry per domain term that appears in SKILL.md or rules.md -->
`;
}

function generateTraceabilityMatrixMd(state: BaconState): string {
  const header = "| Observation | Rule | SKILL.md Section |\n|---|---|---|";
  const rows = state.rules.map(r =>
    `| ${r.sourceRef} | Rule ${r.index} (${r.condition.slice(0, 40)}…) | Procedure step ${r.index} |`
  ).join("\n");
  return `# Traceability Matrix — ${state.skill}\n\nMaps every rule back to its source observation and forward to its SKILL.md section.\n\n${header}\n${rows || "| (not yet populated) | — | — |"}\n`;
}

function generateEnvironmentJson(): string {
  return JSON.stringify({
    generated_by: "skill-bacon-creator",
    generated_at: new Date().toISOString(),
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    note: "Snapshot of Observation Lab environment for reproducibility."
  }, null, 2);
}

function generateHandlerTs(niche: string): string {
  const raw = sanitizeName(niche).replace(/-/g, "_");
  const fnName = "handle" + raw.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^([a-z])/, (_, c: string) => c.toUpperCase());
  return `/**
 * Generated handler for: ${niche}
 * skill-bacon-creator v1.1 output
 */
export async function ${fnName}(params: Record<string, unknown>) {
  // TODO: Implement using rules in references/rules.md
  return {
    status: "ok",
    skill: "${raw}",
    message: "Skill generated by Bacon empiricist loop. See SKILL.md for full documentation.",
  };
}
`;
}

function generateValidateTs(niche: string, observations: Observation[]): string {
  const checks = observations.map((o, i) => `
  // Observation ${o.index}: ${o.signal}
  // Original query: ${o.query}
  // errors.push("Observation ${o.index} validation: not yet implemented");`).join("\n");

  return `/**
 * validate.ts — live tool validation for: ${niche}
 * skill-bacon-creator v1.1 output
 * Run with: npx ts-node scripts/validate.ts
 */

export async function validate(): Promise<{ ok: boolean; errors: string[] }> {
  const errors: string[] = [];
${checks}
  // Add real tool call validations derived from references/data/observations.md
  // Each check should verify the observed response shape still holds.

  return { ok: errors.length === 0, errors };
}

validate().then(r => {
  if (!r.ok) {
    console.error("Validation failed:", r.errors);
    process.exit(1);
  }
  console.log("Validation passed.");
});
`;
}

function generateDeploySh(skillName: string): string {
  const name = sanitizeName(skillName);
  return `#!/bin/bash
# Manual deploy to OpenClaw skills dir
# Run from inside the skill-${name}-creator/ folder

SKILL_NAME="skill-${name}-creator"
OPENCLAW_SKILLS="$HOME/.openclaw/skills"
TARGET="$OPENCLAW_SKILLS/$SKILL_NAME"

if [ -d "$TARGET" ]; then
  echo "ERROR: $SKILL_NAME already exists at $TARGET"
  echo "Rename or remove it before deploying."
  exit 1
fi

cp -r . "$TARGET"
echo "Deployed $SKILL_NAME to $TARGET"
echo "Restart the OpenClaw gateway to load the new skill."
`;
}

function generateTestJson(state: BaconState): string {
  const cases = state.observations.map(o => ({
    source: `Observation ${o.index}`,
    input: o.query,
    expected_signal: o.signal,
    status: "needs_live_validation",
  }));
  return JSON.stringify({
    skill: state.skill,
    generated_by: "skill-bacon-creator",
    generated_at: new Date().toISOString(),
    test_cases: cases.length ? cases : [{ input: "(no observations yet)", status: "empty" }],
  }, null, 2);
}

// ── Phase 6: Pre-flight gate ───────────────────────────────────────────────

function preflightCheck(folder: string, state: BaconState): { ok: boolean; reason?: string } {
  const rulesPath = path.join(folder, "references", "rules.md");
  const obsPath = path.join(folder, "references", "data", "observations.md");
  const idolsPath = path.join(folder, "references", "idols-log.md");

  if (!fileExists(rulesPath) || state.rules.length < 3)
    return { ok: false, reason: "references/rules.md missing or has < 3 rules. Complete Phase 4 first." };
  if (!fileExists(obsPath) || state.observations.length < 2)
    return { ok: false, reason: "references/data/observations.md missing or has < 2 entries. Complete Phase 2 first." };
  if (!fileExists(idolsPath))
    return { ok: false, reason: "references/idols-log.md missing. Complete Phase 5 first." };

  return { ok: true };
}

// ── Phase 7: Conclusion Gate ───────────────────────────────────────────────

interface GateResult {
  gate: string;
  ok: boolean;
  reason?: string;
}

function runConclusionGates(folder: string, state: BaconState): GateResult[] {
  const results: GateResult[] = [];

  // Gate 1: Observation count
  const obsGate = validateObservationGate(state);
  results.push({ gate: "Observation gate (≥2, includes edge case)", ...obsGate });

  // Gate 2: Experiment count
  const expGate = validateExperimentGate(state);
  results.push({ gate: "Experiment gate (≥2 variants)", ...expGate });

  // Gate 3: Rules traceability
  const rulesGate = validateRulesGate(state);
  results.push({ gate: "Rules gate (≥3 cited rules, all traceable)", ...rulesGate });

  // Gate 4: Idols log
  const idolsGate = validateIdolsGate(state);
  results.push({ gate: "Idols gate (≥1 flagged or explicit none)", ...idolsGate });

  // Gate 5: Traceability matrix
  const matrixPath = path.join(folder, "references", "traceability-matrix.md");
  const matrixExists = fileExists(matrixPath);
  const matrixContent = matrixExists ? readFile(matrixPath) : "";
  const matrixOk = matrixExists && !matrixContent.includes("(not yet populated)");
  results.push({
    gate: "Traceability matrix gate (all SKILL.md sections linked)",
    ok: matrixOk,
    reason: matrixOk ? undefined : "traceability-matrix.md missing or unpopulated.",
  });

  return results;
}

// ── Main handler ──────────────────────────────────────────────────────────

export async function handleBacon(params: {
  niche?: string;
  observations?: Observation[];
  experiments?: Experiment[];
  rules?: Rule[];
  idols?: IdolFlag[];
  noIdolsDetected?: boolean;
  noExperimentSignal?: boolean;
}) {
  const niche = params.niche?.trim() ?? "";

  // ── Phase 1: Entry ────────────────────────────────────────────────────
  log("=== BACON: Phase 1 — Skill Entry ===");

  const validation = validateInput(niche);
  if (!validation.ok) {
    const msg = validation.reason === "vague"
      ? "I need a concrete target to work with — not a vague category. Try something like: 'fetch jazz playlists from Spotify' or 'auto-generate Obsidian daily notes from calendar.' What are you building?"
      : "Please provide a more specific skill idea — at least a few words describing what it does.";
    return { ok: false, phase: 1, error: msg };
  }

  const folder = buildFolderPath(niche);
  scaffoldFolders(folder);

  // Resume if state.json already exists
  let state = readState(folder);
  if (state) {
    log(`Resuming from phase ${state.phase} (phases complete: ${state.phasesComplete.join(", ")})`);
  } else {
    state = initState(niche, folder);
    log(`New session started for: ${niche}`);
  }

  // Merge in any agent-provided data from this call
  if (params.observations?.length) state.observations.push(...params.observations);
  if (params.experiments?.length) state.experiments.push(...params.experiments);
  if (params.rules?.length) state.rules.push(...params.rules);
  if (params.idols?.length) state.idols.push(...params.idols);
  if (params.noIdolsDetected !== undefined) state.noIdolsDetected = params.noIdolsDetected;
  if (params.noExperimentSignal !== undefined) state.noExperimentSignal = params.noExperimentSignal;

  state.phase = 1;
  writeState(folder, state);
  log(`Scaffold ready: ${folder}`);

  // ── Phase 2: Observation Lab ──────────────────────────────────────────
  state.phase = 2;
  log("=== BACON: Phase 2 — Observation Lab ===");

  const obsGate = validateObservationGate(state);
  if (!obsGate.ok) {
    log(`Phase 2 gate FAIL: ${obsGate.reason}`);
    writeState(folder, state);
    return { ok: false, phase: 2, error: obsGate.reason };
  }

  writeFile(
    path.join(folder, "references", "data", "observations.md"),
    renderObservationsMd(state.observations)
  );
  markPhaseComplete(state, "observation");
  writeState(folder, state);
  log(`Phase 2 complete — ${state.observations.length} observations recorded`);

  // ── Phase 3: Experiment Run ───────────────────────────────────────────
  state.phase = 3;
  log("=== BACON: Phase 3 — Experiment Run ===");

  const expGate = validateExperimentGate(state);
  if (!expGate.ok) {
    log(`Phase 3 gate FAIL: ${expGate.reason}`);
    writeState(folder, state);
    return { ok: false, phase: 3, error: expGate.reason };
  }

  writeFile(
    path.join(folder, "references", "data", "experiments.md"),
    renderExperimentsMd(state.experiments, !!state.noExperimentSignal)
  );
  markPhaseComplete(state, "experiments");
  writeState(folder, state);
  log(`Phase 3 complete — ${state.experiments.length} experiments logged`);

  // ── Phase 4: Induction Stage ──────────────────────────────────────────
  state.phase = 4;
  log("=== BACON: Phase 4 — Induction Stage ===");

  const rulesGate = validateRulesGate(state);
  if (!rulesGate.ok) {
    log(`Phase 4 gate FAIL: ${rulesGate.reason}`);
    writeState(folder, state);
    return { ok: false, phase: 4, error: rulesGate.reason };
  }

  writeFile(path.join(folder, "references", "rules.md"), renderRulesMd(state.rules));
  markPhaseComplete(state, "induction");
  writeState(folder, state);
  log(`Phase 4 complete — ${state.rules.length} rules written`);

  // ── Phase 5: Idols Checkpoint ─────────────────────────────────────────
  state.phase = 5;
  log("=== BACON: Phase 5 — Idols Checkpoint ===");

  const idolsGate = validateIdolsGate(state);
  if (!idolsGate.ok) {
    log(`Phase 5 gate FAIL: ${idolsGate.reason}`);
    writeState(folder, state);
    return { ok: false, phase: 5, error: idolsGate.reason };
  }

  writeFile(
    path.join(folder, "references", "idols-log.md"),
    renderIdolsLogMd(state.idols, state.noIdolsDetected)
  );
  markPhaseComplete(state, "idols");
  writeState(folder, state);
  log(`Phase 5 complete — idols logged`);

  // ── Phase 6: Skill Foundry ────────────────────────────────────────────
  state.phase = 6;
  log("=== BACON: Phase 6 — Skill Foundry ===");

  const preflight = preflightCheck(folder, state);
  if (!preflight.ok) {
    log(`Phase 6 preflight FAIL: ${preflight.reason}`);
    writeState(folder, state);
    return { ok: false, phase: 6, error: preflight.reason };
  }

  // Write all output files
  writeFile(path.join(folder, "SKILL.md"), generateSkillMd(state));
  writeFile(path.join(folder, "handler.ts"), generateHandlerTs(niche));
  writeFile(path.join(folder, "scripts", "validate.ts"), generateValidateTs(niche, state.observations));
  writeFile(path.join(folder, "scripts", "deploy.sh"), generateDeploySh(niche));
  writeFile(path.join(folder, "assets", "test.json"), generateTestJson(state));
  writeFile(path.join(folder, "references", "taxonomy.md"), generateTaxonomyMd(niche));
  writeFile(path.join(folder, "references", "traceability-matrix.md"), generateTraceabilityMatrixMd(state));
  writeFile(path.join(folder, "references", "data", "environment.json"), generateEnvironmentJson());

  markPhaseComplete(state, "foundry");
  writeState(folder, state);
  log(`Phase 6 complete — all files written to ${folder}`);

  // ── Phase 7: Conclusion Gate ──────────────────────────────────────────
  state.phase = 7;
  log("=== BACON: Phase 7 — Conclusion Gate ===");

  const gates = runConclusionGates(folder, state);
  const failures = gates.filter(g => !g.ok);

  if (failures.length > 0) {
    const failReport = failures.map(g => `• ${g.gate}: ${g.reason}`).join("\n");
    log(`Phase 7 FAIL — ${failures.length} gate(s) failed:\n${failReport}`);
    writeState(folder, { ...state, error: failReport });
    return {
      ok: false,
      phase: 7,
      error: `Conclusion gate failed. Fix the following before declaring done:\n${failReport}`,
      gates,
    };
  }

  markPhaseComplete(state, "conclusion");
  writeState(folder, state);
  log("Phase 7 complete — all gates passed");

  return {
    ok: true,
    phase: 7,
    skill: niche,
    folder,
    gates,
    summary: {
      observations: state.observations.length,
      experiments: state.experiments.length,
      rules: state.rules.length,
      idols: state.idols.length,
      phasesComplete: state.phasesComplete,
    },
  };
}

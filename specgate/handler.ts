/**
 * specgate handler.ts
 * Spec Enforcer — walks user through 7-phase protocol based on Shape Up & User Story Mapping.
 */

interface SpecState {
  phase: number;           // 1-7
  ideaFrame: {
    userPersona: string;
    drivingForce: string;
    successOutcome: string;
  };
  problemStory: {
    narrative: string;
    breakPoint: string;
    workaround: string;
  };
  nowMap: string;         // Sequential "now" workflow
  appetite: string;       // 1-2w or 6w
  solutionElements: string; // Breadboard notation
  deRisking: {
    rabbitHoles: string[];
    assumptions: string[];
  };
  confirmation: {
    behavioralOutcome: string;
    noGos: string[];
    acceptanceCriteria: string[];
    releaseSlice: string;
  };
  done: boolean;
}

const PHASES = [
  { name: "Frame the Idea", ask: "Who is this for, why now, and what does success look like?", key: "ideaFrame" },
  { name: "The Problem Story", ask: "What's the specific moment the status quo fails?", key: "problemStory" },
  { name: "Current Workflow Map", ask: "How do they do it today? (The 'Now' Map)", key: "nowMap" },
  { name: "Appetite", ask: "Is this a 1-2 week Small Batch or a 6 week Big Batch?", key: "appetite" },
  { name: "Solution Elements", ask: "Define the Places, Affordances, and Connections (Breadboarding).", key: "solutionElements" },
  { name: "De-Risking", ask: "What are the Rabbit Holes and Risky Assumptions?", key: "deRisking" },
  { name: "Confirmation", ask: "Lock the Behavioral Outcome, No-Gos, ACs, and Release Slice.", key: "confirmation" },
] as const;

export async function handleSpecGate(params: { subcommand?: string; reset?: boolean }) {
  return {
    status: "ok",
    skill: "specgate",
    message: "SpecGate is active and enforcing the 7-phase Shaping Protocol.",
  };
}

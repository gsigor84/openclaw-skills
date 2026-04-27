import { spawn } from "node:child_process";
import path from "node:path";

/**
 * personal-accountability-coach Handler (v3.0)
 * Refactored for Async execution to prevent SIGTERM/Timeouts.
 */
const handler = async (params: {
  command?: string;
  message?: string;
}) => {
  const SKILL_DIR = path.dirname(__filename);
  const SCRIPTS_DIR = path.join(SKILL_DIR, "scripts");
  const PYTHON =
    process.env.PERSONAL_ACCOUNTABILITY_COACH_PYTHON ||
    process.env.PERSONAL_COACH_PYTHON ||
    "python3";

  const rawMessage = params.message || "pulse";

  const runPythonScript = (scriptName: string, args: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      const pyProcess = spawn(PYTHON, [path.join(SCRIPTS_DIR, scriptName), ...args]);
      let stdout = "";
      let stderr = "";

      pyProcess.stdout.on("data", (data) => (stdout += data.toString()));
      pyProcess.stderr.on("data", (data) => (stderr += data.toString()));

      const timeout = setTimeout(() => {
        pyProcess.kill();
        reject(new Error(`Script ${scriptName} timed out after 300s`));
      }, 300000); // 5 minute timeout

      pyProcess.on("close", (code) => {
        clearTimeout(timeout);
        if (code === 0) resolve(stdout.trim());
        else reject(new Error(`Script ${scriptName} exited with code ${code}: ${stderr}`));
      });
    });
  };

  try {
    // 1. Get current state
    const stateJson = await runPythonScript("state_manager.py", []).catch(() => "{}");

    // 2. Generate response from coach_engine.py
    const response = await runPythonScript("coach_engine.py", [rawMessage, stateJson]);

    return response;
  } catch (error: any) {
    console.error(`コーチ・エンジン・エラー: ${error.message}`);
    return `⚠️ System Update: The coaching session is temporarily delayed. Error: ${error.message}`;
  }
};

export default handler;


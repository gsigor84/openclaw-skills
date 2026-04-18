import handler from "./handler.ts";

async function run() {
  const subcommand = process.argv[2] as string | undefined;
  
  if (subcommand) {
    const result = await handler({ subcommand });
    console.log(result);
  } else {
    // Default test behavior
    console.log("--- Testing Nudger Status ---");
    const status = await handler({ subcommand: "status" });
    console.log(status);
    
    console.log("\n--- Testing Nudge Trigger (Dry Run) ---");
    const nudge = await handler({ subcommand: "trigger-next" });
    console.log(nudge);
  }
}

run().catch(console.error);

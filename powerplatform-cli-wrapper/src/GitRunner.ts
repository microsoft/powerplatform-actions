import { createCommandRunner } from "./CommandRunner";
import { Logger } from "./Logger";

export function createGitRunner(workingDir: string, logger: Logger): GitRunner {
  const runCommand = createCommandRunner(workingDir, "git", logger);
  return {
    log: async () => runCommand("log"),
  };
}

export interface GitRunner {
  log(): Promise<string[]>;
}

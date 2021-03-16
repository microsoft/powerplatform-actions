import { createCommandRunner } from "./CommandRunner";
import { Logger } from "./Logger";

export function createPacRunner(
  workingDir: string,
  exePath: string,
  logger: Logger
): PacRunner {
  const runCommand = createCommandRunner(workingDir, exePath, logger);
  return {
    org: {
      who: () => runCommand("org", "who"),
    },
    help: () => runCommand(),
    auth: {
      list: () => runCommand("auth", "list"),
    },
  };
}

interface PacRunner {
  org: {
    who: () => Promise<string[]>;
  };
  auth: {
    list: () => Promise<string[]>;
  };
  help: () => Promise<string[]>;
}

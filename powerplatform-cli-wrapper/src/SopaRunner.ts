import { createCommandRunner } from "./CommandRunner";
import { Logger } from "./Logger";

export function createSopaRunner(
  workingDir: string,
  sopaExePath: string,
  logger: Logger
): SopaRunner {
  const runCommand = createCommandRunner(workingDir, sopaExePath, logger);

  return {
    help: () => runCommand(),
    pack: (parameters: PackParameters) =>
      runCommand(
        "/nologo",
        "/action:pack",
        `/folder:${parameters.folder}`,
        `/zipFile:${parameters.zipFile}`
      ),
  };
}

interface SopaRunner {
  help: () => Promise<string[]>;
  pack: (parameters: PackParameters) => Promise<string[]>;
}

interface PackParameters {
  folder: string;
  zipFile: string;
}

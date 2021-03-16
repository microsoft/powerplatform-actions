import { spawn } from "child_process";
import { env } from "process";
import { EOL } from "os";
import { Logger } from "./Logger";
import restrictPlatformToWindows from "./restrictPlatformToWindows";

export function createCommandRunner(
  workingDir: string,
  commandPath: string,
  logger: Logger
): CommandRunner {
  restrictPlatformToWindows();

  return async function run(...args: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      logInitialization(...args);

      const stdout: string[] = [];
      const stderr: string[] = [];

      const process = spawn(commandPath, args, {
        cwd: workingDir,
        env: { PATH: env.PATH },
      });

      process.stdout.on("data", (data) =>
        stdout.push(...data.toString().split(EOL))
      );
      process.stderr.on("data", (data) =>
        stderr.push(...data.toString().split(EOL))
      );

      process.on("close", (code: number) => {
        if (code === 0) {
          logSuccess(stdout);
          resolve(stdout);
        } else {
          const allOutput = stderr.concat(stdout);
          logger.error(`error: ${code}: ${allOutput.join(EOL)}`);
          reject(new RunnerError(code, allOutput.join()));
        }
      });
    });
  };

  function logInitialization(...args: string[]): void {
    logger.info(
      `command: ${commandPath}, first arg of ${args.length}: ${
        args.length ? args[0] : "<none>"
      }`
    );
  }

  function logSuccess(output: string[]): void {
    logger.info(`success: ${output.join(EOL)}`);
  }
}

type CommandRunner = (...args: string[]) => Promise<string[]>;

export class RunnerError extends Error {
  public constructor(public exitCode: number, message: string) {
    super(message);
  }
}

import { createCommandRunner } from "./CommandRunner";
import { Logger } from "./Logger";

export function createPacRunner(
  workingDir: string,
  exePath: string,
  logger: Logger
): PacRunner {
  const runCommand = createCommandRunner(workingDir, exePath, logger);
  const admin = ["--kind", "ADMIN"];
  return {
    org: {
      who: () => runCommand("org", "who"),
    },
    help: () => runCommand(),
    auth: {
      list: () => runCommand("auth", "list"),
      createCdsClientCredentials: (
        parameters: CdsEnvironment & ClientCredentials
      ) =>
        runCommand(
          "auth",
          "create",
          ...addUrl(parameters),
          ...addClientCredentials(parameters)
        ),
      createAdminClientCredentials: (parameters: ClientCredentials) =>
        runCommand(
          "auth",
          "create",
          ...admin,
          ...addClientCredentials(parameters)
        ),
      createCdsUsernamePassword: (
        parameters: CdsEnvironment & UsernamePassword
      ) =>
        runCommand(
          "auth",
          "create",
          ...addUrl(parameters),
          ...addUsernamePassword(parameters)
        ),
      createAdminUsernamePassword: (parameters: UsernamePassword) =>
        runCommand(
          "auth",
          "create",
          ...admin,
          ...addUsernamePassword(parameters)
        ),
      clear: () => runCommand("auth", "clear"),
    },
  };

  function addUrl(parameters: CdsEnvironment) {
    return ["--url", parameters.envUrl];
  }

  function addClientCredentials(parameters: ClientCredentials) {
    return [
      "--tenant",
      parameters.tenantId,
      "--applicationId",
      parameters.appId,
      "--clientSecret",
      parameters.clientSecret,
    ];
  }

  function addUsernamePassword(parameters: UsernamePassword) {
    return [
      "--username",
      parameters.username,
      "--password",
      parameters.password,
    ];
  }
}

export interface PacRunner {
  org: {
    who: () => Promise<string[]>;
  };
  auth: {
    list: () => Promise<string[]>;
    createCdsClientCredentials: (
      parameters: CdsEnvironment & ClientCredentials
    ) => Promise<string[]>;
    createAdminClientCredentials: (
      parameters: ClientCredentials
    ) => Promise<string[]>;
    createCdsUsernamePassword: (
      parameters: CdsEnvironment & UsernamePassword
    ) => Promise<string[]>;
    createAdminUsernamePassword: (
      parameters: UsernamePassword
    ) => Promise<string[]>;
    clear: () => Promise<string[]>;
  };
  help: () => Promise<string[]>;
}

export interface ClientCredentials {
  appId: string;
  clientSecret: string;
  tenantId: string;
}

export interface CdsEnvironment {
  envUrl: string;
}

export interface UsernamePassword {
  username: string;
  password: string;
}

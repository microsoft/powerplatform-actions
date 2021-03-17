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
    help: () => runCommand(),
    whoAmI: () => runCommand("org", "who"),
    getAuthenticationProfiles: () => runCommand("auth", "list"),
    clearAuthenticationProfiles: () => runCommand("auth", "clear"),
    authenticateCdsWithClientCredentials: (
      parameters: CdsEnvironment & ClientCredentials
    ) =>
      runCommand(
        "auth",
        "create",
        ...addUrl(parameters),
        ...addClientCredentials(parameters)
      ),
    authenticateAdminWithClientCredentials: (parameters: ClientCredentials) =>
      runCommand(
        "auth",
        "create",
        ...admin,
        ...addClientCredentials(parameters)
      ),
    authenticateCdsWithUsernamePassword: (
      parameters: CdsEnvironment & UsernamePassword
    ) =>
      runCommand(
        "auth",
        "create",
        ...addUrl(parameters),
        ...addUsernamePassword(parameters)
      ),
    authenticateAdminWithUsernamePassword: (parameters: UsernamePassword) =>
      runCommand(
        "auth",
        "create",
        ...admin,
        ...addUsernamePassword(parameters)
      ),
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
  help: () => Promise<string[]>;
  whoAmI: () => Promise<string[]>;
  getAuthenticationProfiles: () => Promise<string[]>;
  clearAuthenticationProfiles: () => Promise<string[]>;
  authenticateCdsWithClientCredentials: (
    parameters: CdsEnvironment & ClientCredentials
  ) => Promise<string[]>;
  authenticateAdminWithClientCredentials: (
    parameters: ClientCredentials
  ) => Promise<string[]>;
  authenticateCdsWithUsernamePassword: (
    parameters: CdsEnvironment & UsernamePassword
  ) => Promise<string[]>;
  authenticateAdminWithUsernamePassword: (
    parameters: UsernamePassword
  ) => Promise<string[]>;
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

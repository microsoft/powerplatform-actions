import { PacRunner } from "powerplatform-cli-wrapper";
import { PacRunner as LegacyRunner } from "./pacRunner";

export function createLegacyRunnerPacAuthenticator(
    pac: LegacyRunner
): PacAuthenticator {
    return {
        authenticateCdsWithClientCredentials: async (
            parameters: ClientCredentials & CdsEnvironment
        ) => {
            await clearAuth();
            await pac.run([
                "auth",
                "create",
                "--url",
                parameters.envUrl,
                "--applicationId",
                parameters.appId,
                "--clientSecret",
                parameters.clientSecret,
                "--tenant",
                parameters.tenantId,
            ]);
        },
        authenticateAdminWithClientCredentials: async (
            parameters: ClientCredentials
        ) => {
            await clearAuth();
            await pac.run([
                "auth",
                "create",
                "--kind",
                "ADMIN",
                "--applicationId",
                parameters.appId,
                "--clientSecret",
                parameters.clientSecret,
                "--tenant",
                parameters.tenantId,
            ]);
        },
        authenticateCdsWithUsernamePassword: async (
            parameters: UsernamePassword & CdsEnvironment
        ) => {
            await clearAuth();
            await pac.run([
                "auth",
                "create",
                "--url",
                parameters.envUrl,
                "--username",
                parameters.username,
                "--password",
                parameters.password,
            ]);
        },
        authenticateAdminWithUsernamePassword: async (
            parameters: UsernamePassword
        ) => {
            await clearAuth();
            await pac.run([
                "auth",
                "create",
                "--kind",
                "ADMIN",
                "--username",
                parameters.username,
                "--password",
                parameters.password,
            ]);
        },
    };

    async function clearAuth() {
        await pac.run(["auth", "clear"]);
    }
}

export interface PacAuthenticator {
    authenticateCdsWithClientCredentials(
        parameters: ClientCredentials & CdsEnvironment
    ): Promise<void>;
    authenticateAdminWithClientCredentials(
        parameters: ClientCredentials
    ): Promise<void>;
    authenticateCdsWithUsernamePassword(
        parameters: UsernamePassword & CdsEnvironment
    ): Promise<void>;
    authenticateAdminWithUsernamePassword(
        parameters: UsernamePassword
    ): Promise<void>;
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

import { PacRunner } from "../pacRunner";
import { PacAuthenticator } from "./PacAuthenticator";
import getEnvironmentUrl from "./getEnvironmentUrl";
import {
    ClientCredentials,
    UsernamePassword,
} from "@microsoft/powerplatform-cli-wrapper/";

export default function createLegacyRunnerPacAuthenticator(
    pac: PacRunner
): PacAuthenticator {
    return {
        authenticateCdsWithClientCredentials: async (
            parameters: ClientCredentials
        ) => {
            await clearAuth();
            await pac.run([
                "auth",
                "create",
                "--url",
                getEnvironmentUrl(),
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
            parameters: UsernamePassword
        ) => {
            await clearAuth();
            await pac.run([
                "auth",
                "create",
                "--url",
                getEnvironmentUrl(),
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

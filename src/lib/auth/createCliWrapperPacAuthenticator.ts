import { PacAuthenticator } from "./PacAuthenticator";
import {
    PacRunner,
    ClientCredentials,
    CdsEnvironment,
    UsernamePassword,
} from "powerplatform-cli-wrapper";

export default function createLegacyRunnerPacAuthenticator(
    pac: PacRunner
): PacAuthenticator {
    return {
        authenticateCdsWithClientCredentials: async (
            parameters: ClientCredentials & CdsEnvironment
        ) => {
            await pac.auth.clear();
            await pac.auth.createCdsClientCredentials(parameters);
        },
        authenticateAdminWithClientCredentials: async (
            parameters: ClientCredentials
        ) => {
            await pac.auth.clear();
            await pac.auth.createAdminClientCredentials(parameters);
        },
        authenticateCdsWithUsernamePassword: async (
            parameters: UsernamePassword & CdsEnvironment
        ) => {
            await pac.auth.clear();
            await pac.auth.createCdsUsernamePassword(parameters);
        },
        authenticateAdminWithUsernamePassword: async (
            parameters: UsernamePassword
        ) => {
            await pac.auth.clear();
            await pac.auth.createAdminUsernamePassword(parameters);
        },
    };
}

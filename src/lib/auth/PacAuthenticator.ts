import {
    ClientCredentials,
    EnvironmentUrlParameters,
    UsernamePassword,
} from "@microsoft/powerplatform-cli-wrapper";

export interface PacAuthenticator {
    authenticateCdsWithClientCredentials(
        parameters: ClientCredentials & EnvironmentUrlParameters
    ): Promise<void>;
    authenticateAdminWithClientCredentials(
        parameters: ClientCredentials
    ): Promise<void>;
    authenticateCdsWithUsernamePassword(
        parameters: UsernamePassword & EnvironmentUrlParameters
    ): Promise<void>;
    authenticateAdminWithUsernamePassword(
        parameters: UsernamePassword
    ): Promise<void>;
}

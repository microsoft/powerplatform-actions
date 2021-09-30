import {
    ClientCredentials,
    UsernamePassword,
} from "@microsoft/powerplatform-cli-wrapper";

export interface PacAuthenticator {
    authenticateCdsWithClientCredentials(
        parameters: ClientCredentials
    ): Promise<void>;
    authenticateAdminWithClientCredentials(
        parameters: ClientCredentials
    ): Promise<void>;
    authenticateCdsWithUsernamePassword(
        parameters: UsernamePassword
    ): Promise<void>;
    authenticateAdminWithUsernamePassword(
        parameters: UsernamePassword
    ): Promise<void>;
}

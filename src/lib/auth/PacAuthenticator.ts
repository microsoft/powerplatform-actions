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

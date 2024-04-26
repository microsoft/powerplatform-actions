import { getInput as coreGetInput } from "@actions/core";
import {
    ClientCredentials,
    FederatedCredentials,
    UsernamePassword,
    AuthCredentials
} from "@microsoft/powerplatform-cli-wrapper";

export default function getCredentials(): AuthCredentials {
    const usernamePassword: UsernamePassword = {
        username: getInput("user-name"),
        password: getInput("password-secret"),
        encodePassword: true,
        cloudInstance: getInput("cloud"),
    };
    const isUpValid = isUsernamePasswordValid(usernamePassword);

    const clientCredentials: ClientCredentials = {
        appId: getInput("app-id"),
        clientSecret: getInput("client-secret"),
        encodeSecret: true,
        tenantId: getInput("tenant-id"),
        cloudInstance: getInput("cloud"),
        scheme: '', // no MgtIdentity support for Actions yet
    };
    const isCcValid = isClientCredentialsValid(clientCredentials);

    const federatedCredentials: FederatedCredentials = {
        tenantId: getInput("tenant-id"),
        appId: getInput("app-id"),
        cloudInstance: getInput("cloud"),
        federationProvider: "GitHub",
        scheme: 'WorkloadIdentityFederation'
    }
    const isFcValid = isFederatedCredentialsValid(federatedCredentials);

    if (isUpValid && isCcValid) {
        throw new Error(
            "Too many authentication parameters specified. Must pick either username/password or app-id/client-secret/tenant-id for the authentication flow."
        );
    }
    if (isUpValid) {
        return usernamePassword;
    }
    if (isCcValid) {
        return clientCredentials;
    }
    if (isFcValid) {
        return federatedCredentials;
    }
    throw new Error(
        "Must provide either username/password or app-id/client-secret/tenant-id for authentication!"
    );
}

function getInput(name: string) {
    return coreGetInput(name, { required: false });
}

function isUsernamePasswordValid(usernamePassword: UsernamePassword) {
    return !!usernamePassword.username && !!usernamePassword.password;
}

function isClientCredentialsValid(clientCredentials: ClientCredentials) {
    return (
        !!clientCredentials.appId &&
        !!clientCredentials.clientSecret &&
        !!clientCredentials.tenantId
    );
}

function isFederatedCredentialsValid(federatedCredentials: FederatedCredentials) {
    return !!federatedCredentials.appId && !!federatedCredentials.tenantId;
}

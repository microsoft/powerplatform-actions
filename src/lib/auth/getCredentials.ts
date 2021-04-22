import { getInput as coreGetInput } from "@actions/core";
import {
    ClientCredentials,
    UsernamePassword,
} from "@microsoft/powerplatform-cli-wrapper";

export default function getCredentials(): UsernamePassword | ClientCredentials {
    const usernamePassword: UsernamePassword = {
        username: getInput("user-name"),
        password: getInput("password-secret"),
    };
    const isUpValid = isUsernamePasswordValid(usernamePassword);

    const clientCredentials: ClientCredentials = {
        appId: getInput("app-id"),
        clientSecret: getInput("client-secret"),
        tenantId: getInput("tenant-id"),
    };
    const isCcValid = isClientCredentialsValid(clientCredentials);

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

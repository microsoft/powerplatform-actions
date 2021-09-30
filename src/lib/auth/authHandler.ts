// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from "@actions/core";
import { PacRunner } from "../pacRunner";
import { Runner } from "../runnerFactory";
import createLegacyRunnerPacAuthenticator from "./createLegacyRunnerPacAuthenticator";
import { PacAuthenticator } from "./PacAuthenticator";

export class AuthHandler {
    private _envUrl!: string;
    private _username!: string;
    private _password!: string;
    private _appId!: string;
    private _clientSecret!: string;
    private _tenantId!: string;
    private _pacAuthenticator: PacAuthenticator;

    constructor(pac: PacAuthenticator | Runner) {
        if ("run" in pac) {
            this._pacAuthenticator = createLegacyRunnerPacAuthenticator(
                pac as PacRunner
            );
        } else {
            this._pacAuthenticator = pac;
        }
    }

    public async authenticate(authKind: AuthKind): Promise<void> {
        core.startGroup("authentication");
        this._envUrl = core.getInput("environment-url", { required: false });
        const authType = this.determineAuthType();

        if (authType === AuthTypes.USERNAME_PASSWORD) {
            await this.authenticateWithUsernamePassword(authKind);
        } else if (authType == AuthTypes.APPID_SECRET) {
            await this.authenticateWithClientCredentials(authKind);
        } else {
            throw new Error(
                "Must provide either username/password or app-id/client-secret/tenant-id for authentication!"
            );
        }
        core.endGroup();
    }

    private determineAuthType(): AuthTypes {
        const validUsernameAuth = this.isValidUsernameAuth();
        const validSPNAuth = this.isValidSPNAuth();

        try {
            if (validUsernameAuth && validSPNAuth) {
                throw new Error(
                    "Too many authentication parameters specified. Must pick either username/password or app-id/client-secret/tenant-id for the authentication flow."
                );
            }

            if (validUsernameAuth) {
                return AuthTypes.USERNAME_PASSWORD;
            } else if (validSPNAuth) {
                return AuthTypes.APPID_SECRET;
            }
        } catch (error) {
            core.setFailed(`failed: ${error.message}`);
            throw error;
        }

        return AuthTypes.INVALID_AUTH_TYPE;
    }

    private isValidUsernameAuth(): boolean {
        this._username = core.getInput("user-name", { required: false });
        this._password = core.getInput("password-secret", { required: false });
        return !!this._username && !!this._password;
    }

    private isValidSPNAuth(): boolean {
        this._appId = core.getInput("app-id", { required: false });
        this._clientSecret = core.getInput("client-secret", {
            required: false,
        });
        this._tenantId = core.getInput("tenant-id", { required: false });
        return !!this._appId && !!this._clientSecret && !!this._tenantId;
    }

    private async authenticateWithClientCredentials(
        authKind: AuthKind
    ): Promise<void> {
        core.info(
            `SPN Authentication : Authenticating with appId: ${this._appId}`
        );
        if (authKind === AuthKind.CDS) {
            await this._pacAuthenticator.authenticateCdsWithClientCredentials({
                tenantId: this._tenantId,
                appId: this._appId,
                clientSecret: this._clientSecret,
            });
        } else {
            await this._pacAuthenticator.authenticateAdminWithClientCredentials(
                {
                    tenantId: this._tenantId,
                    appId: this._appId,
                    clientSecret: this._clientSecret,
                }
            );
        }
    }

    private async authenticateWithUsernamePassword(
        authKind: AuthKind
    ): Promise<void> {
        core.info(
            `Username/password Authentication : Authenticating with user: ${this._username}`
        );
        if (authKind == AuthKind.CDS) {
            await this._pacAuthenticator.authenticateCdsWithUsernamePassword({
                username: this._username,
                password: this._password,
            });
        } else {
            await this._pacAuthenticator.authenticateAdminWithUsernamePassword({
                username: this._username,
                password: this._password,
            });
        }
    }
}

enum AuthTypes {
    USERNAME_PASSWORD,
    APPID_SECRET,
    INVALID_AUTH_TYPE,
}

export enum AuthKind {
    CDS,
    ADMIN,
}

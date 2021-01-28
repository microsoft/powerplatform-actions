// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { Runner, RunnerFactory } from '.';

export class AuthHandler {


    private _envUrl: string | undefined;
    private _username: string | undefined;
    private _password: string | undefined;
    private _appId: string | undefined;
    private _clientSecret: string | undefined;
    private _tenantId: string | undefined;
    private _pac: Runner;

    constructor(private readonly factory: RunnerFactory) {
        this._pac = factory.getRunner('pac', process.cwd());
    }

    public async authenticate(authKind : AuthKind) : Promise<void> {
        core.startGroup('authentication')
        this._envUrl = core.getInput('environment-url', { required: false });
        const authType = this.determineAuthType();

        if (authType === AuthTypes.USERNAME_PASSWORD) {
            await this.authenticateWithUsernamePassword(authKind);
        } else if (authType == AuthTypes.APPID_SECRET) {
            await this.authenticateWithClientCredentials(authKind);
        } else {
            throw new Error('Must provide either username/password or client credential for authentication!');
        }
        core.endGroup();
    }

    private determineAuthType(): AuthTypes {

        const validUsernameAuth = this.isValidUsernameAuth();
        const validSPNAuth = this.isValidSPNAuth();

        try{
            if (validUsernameAuth && validSPNAuth) {
                throw new Error('Must pick either username/password or client credential as the authentication flow.');
            }

            if (validUsernameAuth) {
                return AuthTypes.USERNAME_PASSWORD;
            }
            else if (validSPNAuth) {
                return AuthTypes.APPID_SECRET;
            }
        } catch (error){
            core.setFailed(`failed: ${error.message}`);
            throw error;
        }

        return AuthTypes.INVALID_AUTH_TYPE;
    }

    private isValidUsernameAuth(): boolean {
        this._username = core.getInput('user-name', { required: false });
        if (this._username) {
            this._password = core.getInput('password-secret', { required: true});
        }
        return (!!this._username && !!this._password);
    }

    private isValidSPNAuth(): boolean {
        this._appId = core.getInput('app-id', {required: false});
        if (this._appId) {
            this._clientSecret = core.getInput('client-secret', {required: true});
            this._tenantId = core.getInput('tenant-id', {required: true});
        }
        return (!!this._appId && !!this._clientSecret && !!this._tenantId)
    }

    private async authenticateWithClientCredentials(authKind: AuthKind): Promise<void> {
        core.info(`SPN Authentication : Authenticating with appId: ${this._appId}`);
        await this._pac.run(['auth', 'clear']);
        if (authKind === AuthKind.CDS) {
            await this._pac.run(['auth', 'create', '--url', this._envUrl!, '--applicationId', this._appId!, '--clientSecret', this._clientSecret!, '--tenant', this._tenantId!]);
        } else {
            await this._pac.run(['auth', 'create', '--kind', 'ADMIN', '--applicationId', this._appId!, '--clientSecret', this._clientSecret!, '--tenant', this._tenantId!]);
        }
    }

    private async authenticateWithUsernamePassword(authKind: AuthKind): Promise<void> {
        core.info(`Username/password Authentication : Authenticating with user: ${this._username}`);
        await this._pac.run(['auth', 'clear']);
        if (authKind == AuthKind.CDS) {
            await this._pac.run(['auth', 'create', '--url', this._envUrl!, '--username', this._username!, '--password', this._password!]);
        } else {
            await this._pac.run(['auth', 'create', '--kind', 'ADMIN', '--username', this._username!, '--password', this._password!]);
        }
    }
}

enum AuthTypes {
    USERNAME_PASSWORD,
    APPID_SECRET,
    INVALID_AUTH_TYPE
}

export enum AuthKind {
    CDS,
    ADMIN
}

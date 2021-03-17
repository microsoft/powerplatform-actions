// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from "@actions/core";
import { AuthKind, AuthHandler } from "../../lib";
import createActionsPacRunner from "../../lib/createActionsPacRunner";
import createCliWrapperPacAuthenticator from "../../lib/auth/createCliWrapperPacAuthenticator";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})();

export async function main(): Promise<void> {
    try {
        core.startGroup("who-am-i");

        const pac = createActionsPacRunner();

        const authenticator = createCliWrapperPacAuthenticator(pac);
        await new AuthHandler(authenticator).authenticate(AuthKind.CDS);

        await pac.org.who();
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}

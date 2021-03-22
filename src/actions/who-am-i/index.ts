// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from "@actions/core";
import { AuthKind, AuthHandler } from "../../lib";
import createActionsPacRunner from "../../lib/createActionsPacRunner";
import createCliWrapperPacAuthenticator from "../../lib/auth/createCliWrapperPacAuthenticator";
import { PacRunner } from "@microsoft/powerplatform-cli-wrapper";
import { EOL } from "os";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(() => createActionsPacRunner());
    }
})();

export async function main(pacFactory: () => PacRunner): Promise<void> {
    try {
        core.startGroup("who-am-i");

        const pac = pacFactory();

        const authenticator = createCliWrapperPacAuthenticator(pac);
        await new AuthHandler(authenticator).authenticate(AuthKind.CDS);

        await pac.whoAmI();

        core.endGroup();
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(`failed: ${error.message}`);
            console.error(error.stack);
        } else {
            core.setFailed(`failed: ${error}`);
            core.error(error);
        }
    }
}

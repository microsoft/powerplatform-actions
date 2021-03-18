// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from "@actions/core";
import { AuthKind, AuthHandler } from "../../lib";
import createActionsPacRunner from "../../lib/createActionsPacRunner";
import createCliWrapperPacAuthenticator from "../../lib/auth/createCliWrapperPacAuthenticator";
import { PacRunner } from "@microsoft/powerplatform-cli-wrapper";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(createActionsPacRunner());
    }
})();

export async function main(pac: PacRunner): Promise<void> {
    try {
        core.startGroup("who-am-i");

        const authenticator = createCliWrapperPacAuthenticator(pac);
        await new AuthHandler(authenticator).authenticate(AuthKind.CDS);

        await pac.whoAmI();
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}

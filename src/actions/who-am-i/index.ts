// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from "@actions/core";
import { AuthKind, AuthHandler, ActionLogger } from "../../lib";
import { createPacRunner } from "powerplatform-cli-wrapper";
import getExePath from "../../lib/getExePath";
import pacRelativePath from "../../lib/pacRelativePath";
import { cwd } from "process";
import { Runner } from "../../lib";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})();

export async function main(): Promise<void> {
    try {
        core.startGroup("who-am-i");

        const pac = createPacRunner(
            cwd(),
            getExePath(...pacRelativePath),
            new ActionLogger()
        );
        await new AuthHandler((pac as unknown) as Runner).authenticate(
            AuthKind.CDS
        );

        await pac.org.who();
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}

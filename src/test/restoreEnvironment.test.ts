// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { should, use } from "chai";
import { stubInterface } from "ts-sinon";
import * as sinonChai from "sinon-chai";
import rewiremock from "./rewiremock";
import { stub } from "sinon";
import { UsernamePassword } from "@microsoft/powerplatform-cli-wrapper";
import { runnerParameters } from "../../src/lib/runnerParameters";
import Sinon = require("sinon");
import { ActionsHost } from "../lib/host/ActionsHost";
should();
use(sinonChai);

describe("restore-environment tests", () => {
    const restoreEnvironmentStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../../src/actions/restore-environment/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ restoreEnvironment: restoreEnvironmentStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
                mock(() => import("@actions/core")).with({ getInput: () => mockEnvironmentUrl, startGroup: () => undefined, endGroup: () => undefined });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls restoreEnvironmentStub properly", async () => {

        await callActionWithMocks();

        restoreEnvironmentStub.should.have.been.calledWithExactly({
            credentials: credentials,
            sourceEnvironmentUrl: { name: 'source-url', required: true, defaultValue: undefined },
            targetEnvironmentUrl: { name: 'target-url', required: true, defaultValue: undefined },
            restoreLatestBackup: { name: 'latest-backup', required: false, defaultValue: 'true' },
            backupDateTime: { name: 'selected-backup', required: false, defaultValue: undefined },
            targetEnvironmentName: { name: 'friendly-name', required: false, defaultValue: undefined },
        }, runnerParameters, new ActionsHost());
    });
});

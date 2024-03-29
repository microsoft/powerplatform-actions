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

describe("copy-environment tests", () => {
    const copyEnvironmentStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../../src/actions/copy-environment/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ copyEnvironment: copyEnvironmentStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls copyEnvironmentStub properly", async () => {

        await callActionWithMocks();

        copyEnvironmentStub.should.have.been.calledWithExactly({
            credentials: credentials,
            sourceEnvironmentUrl: { name: 'source-url', required: false, defaultValue: undefined },
            targetEnvironmentUrl: { name: 'target-url', required: false, defaultValue: undefined },
            sourceEnvironment: { name: 'source-env', required: false, defaultValue: undefined },
            targetEnvironment: { name: 'target-env', required: false, defaultValue: undefined },
            copyType: { name: 'copy-type', required: false, defaultValue: 'FullCopy' },
            overrideFriendlyName: { name: 'override-friendly-name', required: false, defaultValue: 'false' },
            friendlyTargetEnvironmentName: { name: 'friendly-name', required: false, defaultValue: undefined },
            logToConsole: false,
        }, runnerParameters, new ActionsHost());
    });
});

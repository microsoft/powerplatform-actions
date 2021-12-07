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

describe("backup-environment tests", () => {
    const backupEnvironmentStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../../src/actions/backup-environment/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ backupEnvironment: backupEnvironmentStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls backupEnvironmentStub properly", async () => {

        await callActionWithMocks();

        backupEnvironmentStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environment: { name: 'environment', required: false, defaultValue: undefined },
            environmentUrl: { name: 'environment-url', required: false, defaultValue: undefined },
            environmentId: { name: 'environment-id', required: false, defaultValue: undefined },
            backupLabel: { name: 'backup-label', required: true, defaultValue: undefined },
            notes: { name: 'notes', required: false, defaultValue: undefined },
        }, runnerParameters, new ActionsHost());
    });
});

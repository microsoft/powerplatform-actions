// Copyright (c) Microsoft Corporation.
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

describe("assign-user tests", () => {
    const assignUserStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../actions/assign-user/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ assignUser: assignUserStub });
                mock(() => import("../lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls assignUserStub properly", async () => {

        await callActionWithMocks();

        assignUserStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environment: { name: 'environment', required: true, defaultValue: undefined },
            objectId: { name: 'object-id', required: true, defaultValue: undefined },
            role: { name: 'role', required: false, defaultValue: undefined },
        }, runnerParameters, new ActionsHost());
    });
});

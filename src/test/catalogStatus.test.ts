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
import { runnerParameters } from "../lib/runnerParameters";
import Sinon = require("sinon");
import { ActionsHost } from "../lib/host/ActionsHost";
should();
use(sinonChai);

describe("catalog-status tests", () => {
    const catalogStatusStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../actions/catalog-status/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ catalogStatus: catalogStatusStub });
                mock(() => import("../lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls catalogStatusStub properly", async () => {

        await callActionWithMocks();

        catalogStatusStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            trackingId: { name: 'tracking-id', required: true, defaultValue: undefined },
            requestType: { name: 'type', required: true, defaultValue: undefined },
            logToConsole: false,
        }, runnerParameters, new ActionsHost());
    });
});

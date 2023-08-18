// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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

describe("export-data tests", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportDataStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        await rewiremock.around(() => import("../../src/actions/export-data/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ dataExport: exportDataStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
    }

    it("fetches parameters from index.ts, calls exportDataStub properly", async () => {
        await callActionWithMocks();

        exportDataStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            schemaFile: { name: 'schema-file', required: true, defaultValue: undefined },
            dataFile: { name: 'data-file', required: true, defaultValue: undefined },
            overwrite: { name: 'overwrite', required: false, defaultValue: undefined },
            verbose: { name: 'verbose', required: false, defaultValue: false },
            logToConsole: false,
        }, runnerParameters, new ActionsHost());
    });
});

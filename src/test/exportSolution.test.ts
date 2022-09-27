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

describe("export-solution tests", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportSolutionStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        await rewiremock.around(() => import("../../src/actions/export-solution/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ exportSolution: exportSolutionStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
    }

    it("fetches parameters from index.ts, calls exportSolutionStub properly", async () => {
        await callActionWithMocks();

        exportSolutionStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            name: { name: 'solution-name', required: true, defaultValue: undefined },
            path: { name: 'solution-output-file', required: true, defaultValue: undefined },
            managed: { name: 'managed', required: false, defaultValue: 'false' },
            async: { name: 'run-asynchronously', required: false, defaultValue: 'false' },
            maxAsyncWaitTimeInMin: { name: 'max-async-wait-time', required: false, defaultValue: '60' },
            autoNumberSettings: { name: 'export-auto-numbering-settings', required: false, defaultValue: 'false' },
            calenderSettings: { name: 'export-calendar-settings', required: false, defaultValue: 'false' },
            customizationSettings: { name: 'export-customization-settings', required: false, defaultValue: 'false' },
            emailTrackingSettings: { name: 'export-email-tracking-settings', required: false, defaultValue: 'false' },
            externalApplicationSettings: { name: 'export-external-applications-settings', required: false, defaultValue: 'false' },
            generalSettings: { name: 'export-general-settings', required: false, defaultValue: 'false' },
            isvConfig: { name: 'export-isv-config', required: false, defaultValue: 'false' },
            marketingSettings: { name: 'export-marketing-settings', required: false, defaultValue: 'false' },
            outlookSynchronizationSettings: { name: 'export-outlook-synchronization-settings', required: false, defaultValue: 'false' },
            relationshipRoles: { name: 'export-relationship-roles', required: false, defaultValue: 'false' },
            sales: { name: 'export-sales', required: false, defaultValue: 'false' },
            overwrite: { name: 'overwrite', required: false, defaultValue: 'false' },
        }, runnerParameters, new ActionsHost());
    });
});

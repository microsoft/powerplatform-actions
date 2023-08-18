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

describe("import-solution tests", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const importSolutionStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        await rewiremock.around(() => import("../../src/actions/import-solution/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ importSolution: importSolutionStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
    }

    it("fetches parameters from index.ts, calls importSolutionStub properly", async () => {

        await callActionWithMocks();

        importSolutionStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            path: { name: 'solution-file', required: true, defaultValue: undefined },
            useDeploymentSettingsFile: { name: 'use-deployment-settings-file', required: false, defaultValue: 'false' },
            deploymentSettingsFile: { name: 'deployment-settings-file', required: false, defaultValue: undefined },
            async: { name: 'run-asynchronously', required: false, defaultValue: 'false' },
            maxAsyncWaitTimeInMin: { name: 'max-async-wait-time', required: false, defaultValue: '60' },
            importAsHolding: { name: 'import-as-holding', required: false, defaultValue: 'false' },
            forceOverwrite: { name: 'force-overwrite', required: false, defaultValue: 'true' },
            publishChanges: { name: 'publish-changes', required: false, defaultValue: 'false' },
            skipDependencyCheck: { name: 'skip-dependency-check', required: false, defaultValue: 'false' },
            skipLowerVersion: { name: 'skip-lower-version', required: false, defaultValue: 'false' },
            convertToManaged: { name: 'convert-to-managed', required: false, defaultValue: 'false' },
            activatePlugins: { name: 'activate-plugins', required: false, defaultValue: 'true' },
            logToConsole: false,
        }, runnerParameters, new ActionsHost());
    });
});

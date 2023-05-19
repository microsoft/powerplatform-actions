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

describe("submit-catalog tests", () => {
    const submitCatalogStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../actions/submit-catalog/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ submitCatalog: submitCatalogStub });
                mock(() => import("../lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls submitCatalogStub properly", async () => {

        await callActionWithMocks();

        submitCatalogStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            path: { name: 'path', required: true, defaultValue: undefined },
            packageSolutionZipFile: { name: 'package-or-solution-zip-file', required: false, defaultValue: 'UploadedPackageFile' },
            solutionZip: { name: 'solution-zip', required: false, defaultValue: undefined },
            packageZip: { name: 'package-zip', required: false, defaultValue: undefined },
            pollStatus: { name: 'poll-status', required: false, defaultValue: 'false' }
        }, runnerParameters, new ActionsHost());
    });
});

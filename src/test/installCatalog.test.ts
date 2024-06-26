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

describe("install-catalog tests", () => {
    const installCatalogStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../actions/install-catalog/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ installCatalog: installCatalogStub });
                mock(() => import("../lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls installCatalogStub properly", async () => {

        await callActionWithMocks();

        installCatalogStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            catalogItemId: { name: 'catalog-item-id', required: true, defaultValue: undefined },
            targetEnvironmentUrl: { name: 'target-url', required: false, defaultValue: undefined },
            targetEnvironment: { name: 'target-environment', required: false, defaultValue: undefined },
            settings: { name: 'settings', required: false, defaultValue: undefined },
            targetVersion: { name: 'target-version', required: false, defaultValue: undefined },
            pollStatus: { name: 'poll-status', required: false, defaultValue: 'false' },
            logToConsole: false,
        }, runnerParameters, new ActionsHost());
    });
});

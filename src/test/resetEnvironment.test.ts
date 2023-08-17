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

describe("reset-environment tests", () => {
    const resetEnvironmentStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../../src/actions/reset-environment/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ resetEnvironment: resetEnvironmentStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
                mock(() => import("@actions/core")).with({ getInput: () => mockEnvironmentUrl, startGroup: () => undefined, endGroup: () => undefined });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls resetEnvironmentStub properly", async () => {

        await callActionWithMocks();

        resetEnvironmentStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environment: { name: 'environment', required: false, defaultValue: undefined },
            environmentUrl: { name: 'environment-url', required: false, defaultValue: undefined },
            currency: { name: 'currency', required: false, defaultValue: 'USD' },
            purpose: { name: 'purpose', required: false, defaultValue: undefined },
            templates: { name: 'templates', required: false, defaultValue: undefined },
            language: { name: 'language', required: false, defaultValue: 'English (United States)' },
            overrideDomainName: { name: 'override-domain-name', required: false, defaultValue: 'false' },
            domainName: { name: 'domain-name', required: false, defaultValue: undefined },
            overrideFriendlyName: { name: 'override-friendly-name', required: false, defaultValue: 'false' },
            friendlyEnvironmentName: { name: 'friendly-name', required: false, defaultValue: undefined },
            logToConsole: false,
        }, runnerParameters, new ActionsHost());
    });
});

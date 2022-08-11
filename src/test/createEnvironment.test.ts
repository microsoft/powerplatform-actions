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

describe("create-environment tests", () => {
    const createEnvironmentStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const mockEnvironmentUrl = "https://contoso.crm.dynamics.com/";
    createEnvironmentStub.returns({
        environmentId: "mock-env-id",
        environmentUrl: "mock-env-url"
    });

    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../../src/actions/create-environment/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ createEnvironment: createEnvironmentStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl);
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls createEnvironmentStub properly", async () => {

        await callActionWithMocks();

        createEnvironmentStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentName: { name: 'name', required: true, defaultValue: undefined },
            environmentType: { name: 'type', required: true, defaultValue: 'Sandbox' },
            region: { name: 'region', required: true, defaultValue: 'unitedstates' },
            currency: { name: 'currency', required: false, defaultValue: 'USD' },
            language: { name: 'language', required: false, defaultValue: 'English (United States)' },
            templates: { name: 'templates', required: false, defaultValue: undefined },
            domainName: { name: 'domain', required: false, defaultValue: undefined },
            teamId: {name:'team-id', required: false, defaultValue: undefined},
        }, runnerParameters, new ActionsHost());
    });
});

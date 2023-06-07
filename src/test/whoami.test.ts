// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { should, use } from "chai";
import sinon, { stubInterface } from "ts-sinon";
import * as sinonChai from "sinon-chai";
import rewiremock from "./rewiremock";
import { restore, stub } from "sinon";
import {
    RunnerParameters,
    UsernamePassword,
} from "@microsoft/powerplatform-cli-wrapper";
import * as core from '@actions/core';
import { EnvIdVariableName } from "../host/OutputVariables";
import { ActionsHost } from "../lib/host/ActionsHost";

should();
use(sinonChai);

describe("WhoAmI tests", () => {
    let coreSetOutputSpy: sinon.SinonSpy<[name: string, value: unknown], void>;

    beforeEach(() => {
        coreSetOutputSpy = sinon.spy(core, "setOutput");
    });

    afterEach(() => restore());

    it("calls whoAmI", async () => {
        const whoAmIStub = stub();
        const credentials: UsernamePassword = stubInterface<UsernamePassword>();
        const environmentUrl = "environment url";
        const runnerParameters = stubInterface<RunnerParameters>();
        const mockEnvironmentIdReturn = "mock-env-id"
        whoAmIStub.returns({
            environmentId: mockEnvironmentIdReturn
        });

        await rewiremock.around(
            () => import("../actions/who-am-i/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with(
                    {
                        whoAmI: whoAmIStub,
                    }
                );
                mock(() => import("../lib/auth/getCredentials")).withDefault(
                    () => credentials
                );
                mock(() => import("../lib/auth/getEnvironmentUrl")).withDefault(
                    () => environmentUrl
                );
                mock(() => import("../lib/runnerParameters")).with(
                    {
                        runnerParameters
                    }
                );
            }
        );

        whoAmIStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: environmentUrl,
        }, runnerParameters, new ActionsHost());

        coreSetOutputSpy.should.have.been.calledOnceWith(EnvIdVariableName, mockEnvironmentIdReturn);
    });
});

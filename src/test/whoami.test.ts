// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { should, use } from "chai";
import { stubInterface } from "ts-sinon";
import * as sinonChai from "sinon-chai";
import rewiremock from "./rewiremock";
import { spy, stub } from "sinon";
import {
    Logger,
    RunnerParameters,
    UsernamePassword,
} from "@microsoft/powerplatform-cli-wrapper";
should();
use(sinonChai);

describe("WhoAmI tests", () => {
    it("calls whoAmI", async () => {
        const whoAmIStub = stub();
        const credentials: UsernamePassword = stubInterface<UsernamePassword>();
        const environmentUrl = "environment url";
        const runnerParameters = stubInterface<RunnerParameters>();

        await rewiremock.around(
            () => import("../actions/who-am-i/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper")).with(
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
                mock(() => import("../lib/runnerParameters")).withDefault(
                    runnerParameters
                );
            }
        );

        whoAmIStub.should.have.been.calledOnceWithExactly({
            credentials: credentials,
            environmentUrl: environmentUrl,
            ...runnerParameters,
        });
    });
});

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
import { mockEnvironmentUrl } from "./mockData";

should();
use(sinonChai);

describe("add-solution-component tests", () => {
    const addSolutionComponentStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();


    async function callActionWithMocks(): Promise<void> {
        const mockedModule = await rewiremock.around(() => import("../../src/actions/add-solution-component/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ addSolutionComponent: addSolutionComponentStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => mockEnvironmentUrl );
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
        await mockedModule.main();
    }

    it("fetches parameters from index.ts, calls addSolutionComponentStub properly", async () => {

        await callActionWithMocks();

        addSolutionComponentStub.should.have.been.calledWithExactly({
            credentials: credentials,
            environmentUrl: mockEnvironmentUrl,
            solutionName: {  name: 'solution-name', required: true, defaultValue: undefined },
            component: { name: 'component', required: true, defaultValue: undefined },
            componentType: { name: 'component-type', required: true, defaultValue: undefined },
            addRequiredComponents: { name: 'add-required-components', required: false, defaultValue: undefined },
        }, runnerParameters, new ActionsHost());
    });
});

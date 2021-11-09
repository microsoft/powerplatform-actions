// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { should, use } from "chai";
import { stubInterface } from "ts-sinon";
import * as sinonChai from "sinon-chai";
import rewiremock from "./rewiremock";
import { fake, stub } from "sinon";
import { UsernamePassword } from "@microsoft/powerplatform-cli-wrapper";
import { runnerParameters } from "../../src/lib/runnerParameters";
import Sinon = require("sinon");
import { ActionsHost } from "../lib/host/ActionsHost";
should();
use(sinonChai);

describe("clone solution test", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneSolutionStub: Sinon.SinonStub<any[], any> = stub();
    const credentials: UsernamePassword = stubInterface<UsernamePassword>();
    const environmentUrl = "environment url";

    async function callActionWithMocks(): Promise<void> {
        await rewiremock.around(
            () => import("../../src/actions/clone-solution/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ cloneSolution: cloneSolutionStub });
                mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials);
                mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl);
                mock(() => import("fs/promises")).with({ chmod: fake() });
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
    }

    it("calls clone solution", async () => {

        await callActionWithMocks();

        cloneSolutionStub.should.have.been.calledOnceWithExactly({
            credentials: credentials,
            environmentUrl: environmentUrl,
            name: { name: 'solution-name', required: true, defaultValue: undefined },
            targetVersion: { name: 'solution-version', required: false, defaultValue: undefined },
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
            outputDirectory: { name: 'target-folder', required: false, defaultValue: undefined },
        }, runnerParameters, new ActionsHost());
    });
});

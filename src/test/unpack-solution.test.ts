// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { should, use } from "chai";
import * as sinonChai from "sinon-chai";
import rewiremock from "./rewiremock";
import { fake, stub } from "sinon";
import { runnerParameters } from "../../src/lib/runnerParameters";
import Sinon = require("sinon");
import { ActionsHost } from "../lib/host/ActionsHost";
should();
use(sinonChai);

describe("unpack solution test", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unpackSolutionStub: Sinon.SinonStub<any[], any> = stub();

    async function callActionWithMocks(): Promise<void> {
        await rewiremock.around(
            () => import("../../src/actions/unpack-solution/index"),
            (mock) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ unpackSolution: unpackSolutionStub });
                mock(() => import("fs/promises")).with({ chmod: fake() });
                mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
            });
    }

    it("calls unpack solution", async () => {

        await callActionWithMocks();

        unpackSolutionStub.should.have.been.calledOnceWithExactly({
            solutionZipFile: { name: 'solution-file', required: true, defaultValue: undefined },
            sourceFolder: { name: 'solution-folder', required: true, defaultValue: undefined },
            solutionType: { name: 'solution-type', required: false, defaultValue: "Unmanaged" },
            overwriteFiles: { name: 'overwrite-files', required: false, defaultValue: "true" },
            singleComponent: { name: 'single-component', required: false, defaultValue: 'None' },
            mapFile: { name: 'map-file', required: false, defaultValue: undefined },
            localeTemplate: { name: 'locale-template', required: false, defaultValue: undefined },
            localize: { name: 'localize', required: false, defaultValue: undefined },
            useLcid: { name: 'use-lcid', required: false, defaultValue: 'false' },
            useUnmanagedFileForManaged: {
                name: 'use-unmanaged-file-for-missing-managed',
                required: false,
                defaultValue: 'false'
            },
            disablePluginRemap: {
                name: 'disable-plugin-remap',
                required: false,
                defaultValue: 'false'
            }
        }, runnerParameters, new ActionsHost());
    });
});

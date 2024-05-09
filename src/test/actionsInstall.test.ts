// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { assert, should, use } from "chai";
import * as sinonChai from "sinon-chai";
import rewiremock from "./rewiremock";
import { restore, stub } from "sinon";
import { runnerParameters } from "../lib/runnerParameters";
import Sinon = require("sinon");
import * as os from 'os';

should();
use(sinonChai);

describe("actions-install tests", () => {
    let pathValue: string;
    const addToolsToPath = 'add-tools-to-path';
    const usePreinstalledPac = 'use-preinstalled-pac';
    let inputs: { [key: string]: string };
    const actionsInstallStub: Sinon.SinonStub<unknown[], unknown> = stub();
    let osPlatformStub: Sinon.SinonStub<unknown[], unknown> = stub();

    beforeEach(() => {
        pathValue = '';
        inputs = {};
        osPlatformStub = Sinon.stub(os, 'platform');
    });
    afterEach(() => {
        osPlatformStub.restore();
        restore();
    });

    async function callActionWithMocks(): Promise<void> {
        const toolInstaller = await rewiremock.around(
            () => import("../actions/actions-install/index"),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mock: any) => {
                mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({
                    actionsInstall: actionsInstallStub
                });
                mock(() => import("@actions/core")).with({
                    getInput: (name: string) => inputs[name],
                    startGroup: () => undefined,
                    endGroup: () => undefined,
                    info: () => undefined,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    exportVariable: (name: string, val: string) => undefined,
                    addPath: (path: string) => pathValue = path,
                    warning: () => undefined
                });
                mock(() => import("@actions/io")).with({
                    which: () => Promise.resolve("path/to/pac")
                });
                mock(() => import("@actions/exec")).with({
                    getExecOutput: () => undefined
                });
                mock(() => import("../lib/runnerParameters")).with({
                    runnerParameters: runnerParameters
                });
            });
        await toolInstaller.main();
    }

    function setupTest(platform: string, addTools: string, preinstalledPac?: string) {
        osPlatformStub.returns(platform);
        inputs[addToolsToPath] = addTools;
        if (preinstalledPac) {
            inputs[usePreinstalledPac] = preinstalledPac;
        }
    }

    function assertPathNotEmpty() {
        assert.isNotEmpty(pathValue);
        assert.isTrue(!pathValue.endsWith('pac') && !pathValue.endsWith('pac.exe'));
    }

    function assertPathEmpty() {
        assert.isEmpty(pathValue);
    }

    it("calls actions-install with add-tools-to-path true and calls addPath", async function () {
        setupTest('win32', 'true');
        await callActionWithMocks();
        assertPathNotEmpty();
    });

    it("calls actions-install with add-tools-to-path false and does not call addPath", async function () {
        setupTest('win32', 'false');
        await callActionWithMocks();
        assertPathEmpty();
    });

    it("calls actions-install with add-tools-to-path true + use-preinstalled-pac value and calls addPath", async function () {
        setupTest('win32', 'true', 'out/pac/tools/pac.exe');
        await callActionWithMocks();
        assertPathNotEmpty();
    });

    it("calls actions-install with add-tools-to-path false + use-preinstalled-pac value and does not call addPath", async function () {
        setupTest('win32', 'false', 'out/pac/tools/pac.exe');
        await callActionWithMocks();
        assertPathEmpty();
    });

    it("calls actions-install using dotnetInstall with add-tools-to-path true and calls addPath", async function () {
        setupTest('linux', 'true');
        await callActionWithMocks();
        assertPathNotEmpty();
    });

    it("calls actions-install using dotnetInstall with add-tools-to-path false and does nots addPath", async function () {
        setupTest('linux', 'false');
        await callActionWithMocks();
        assertPathEmpty();
    });
});

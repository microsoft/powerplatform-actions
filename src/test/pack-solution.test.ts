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

describe("pack solution test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packSolutionStub: Sinon.SinonStub<any[], any> = stub();

  async function callActionWithMocks(): Promise<void> {
    await rewiremock.around(
      () => import("../../src/actions/pack-solution/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ packSolution: packSolutionStub });
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
  }

  it("calls pack solution", async () => {

    await callActionWithMocks();

    packSolutionStub.should.have.been.calledOnceWithExactly({
      solutionZipFile: { name: 'solution-file', required: true, defaultValue: undefined },
      sourceFolder: { name: 'solution-folder', required: true, defaultValue: undefined },
      solutionType: { name: 'solution-type', required: false, defaultValue: "Unmanaged" },
    }, runnerParameters, new ActionsHost());
  });
});

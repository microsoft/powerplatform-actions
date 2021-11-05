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

describe("pack solution test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packSolutionStub: Sinon.SinonStub<any[], any> = stub();
  const credentials: UsernamePassword = stubInterface<UsernamePassword>();
  const environmentUrl = "environment url";

  async function callActionWithMocks(): Promise<void> {
    await rewiremock.around(
      () => import("../../src/actions/pack-solution/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ packSolution: packSolutionStub });
        mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
        mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
  }

  it("calls pack solution", async () => {

    await callActionWithMocks();

    packSolutionStub.should.have.been.calledOnceWithExactly({
      credentials: credentials,
      environmentUrl: environmentUrl,
      solutionZipFile: { name: 'solution-file', required: true, defaultValue: undefined },
      sourceFolder: { name: 'solution-folder', required: true, defaultValue: undefined },
      solutionType: { name: 'solution-type', required: false, defaultValue: "Unmanaged" },
    }, runnerParameters, new ActionsHost());
  });
});

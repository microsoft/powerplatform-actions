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

describe("publish solution test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publishSolutionStub: Sinon.SinonStub<any[], any> = stub();
  const credentials: UsernamePassword = stubInterface<UsernamePassword>();
  const environmentUrl = "environment url";

  async function callActionWithMocks(): Promise<void> {
    const publishSolution = await rewiremock.around(
      () => import("../../src/actions/publish-solution/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ publishSolution: publishSolutionStub });
        mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
        mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
    await publishSolution.main();
  }

  it("calls publish solution", async () => {

    await callActionWithMocks();

    publishSolutionStub.should.have.been.calledWithExactly({
      credentials: credentials,
      environmentUrl: environmentUrl,
    }, runnerParameters, new ActionsHost());
  });
});

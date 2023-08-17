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

describe("delete solution test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteSolutionStub: Sinon.SinonStub<any[], any> = stub();
  const credentials: UsernamePassword = stubInterface<UsernamePassword>();
  const environmentUrl = "environment url";

  async function callActionWithMocks(): Promise<void> {
    const deleteSolution = await rewiremock.around(
      () => import("../../src/actions/delete-solution/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ deleteSolution: deleteSolutionStub });
        mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
        mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
      await deleteSolution.main();
  }

  it("calls delete solution", async () => {

    await callActionWithMocks();

    deleteSolutionStub.should.have.been.calledWithExactly({
      credentials: credentials,
      environmentUrl: environmentUrl,
      name: { name: 'solution-name', required: true, defaultValue: undefined },
      logToConsole: false,
    }, runnerParameters, new ActionsHost());
  });
});

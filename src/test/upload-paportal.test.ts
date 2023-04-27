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

describe("upload paportal test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadPaportalStub: Sinon.SinonStub<any[], any> = stub();
  const credentials: UsernamePassword = stubInterface<UsernamePassword>();
  const environmentUrl = "environment url";

  async function callActionWithMocks(): Promise<void> {
    await rewiremock.around(
      () => import("../../src/actions/upload-paportal/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ uploadPaportal: uploadPaportalStub });
        mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
        mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
  }

  it("calls upload paportal", async () => {

    await callActionWithMocks();

    uploadPaportalStub.should.have.been.calledOnceWithExactly({
      credentials: credentials,
      environmentUrl: environmentUrl,
      path: { name: 'upload-path', required: true, defaultValue: undefined },
      deploymentProfile: { name: 'deployment-profile', required: false, defaultValue: undefined },
      modelVersion: { name: 'model-version', required: false, defaultValue: undefined }
    }, runnerParameters, new ActionsHost());
  });
});

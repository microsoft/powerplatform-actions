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

describe("download paportal test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadPaportalStub: Sinon.SinonStub<any[], any> = stub();
  const credentials: UsernamePassword = stubInterface<UsernamePassword>();
  const environmentUrl = "environment url";

  async function callActionWithMocks(): Promise<void> {
    await rewiremock.around(
      () => import("../../src/actions/download-paportal/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ downloadPaportal: downloadPaportalStub });
        mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
        mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
  }

  it("calls download paportal", async () => {

    await callActionWithMocks();

    downloadPaportalStub.should.have.been.calledOnceWithExactly({
      credentials: credentials,
      environmentUrl: environmentUrl,
      path: { name: 'download-path', required: true, defaultValue: undefined },
      websiteId: { name: 'website-id', required: true, defaultValue: undefined },
      overwrite: { name: 'overwrite', required: false, defaultValue: undefined },
      excludeEntities: { name: 'exclude-entities', required: false, defaultValue: undefined}
    }, runnerParameters, new ActionsHost());
  });
});

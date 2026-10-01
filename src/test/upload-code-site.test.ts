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

describe("upload code-site test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadCodeSiteStub: Sinon.SinonStub<any[], any> = stub();
  const credentials: UsernamePassword = stubInterface<UsernamePassword>();
  const environmentUrl = "environment url";

  async function callActionWithMocks(): Promise<void> {
    await rewiremock.around(
      () => import("../../src/actions/upload-code-site/index"),
      (mock) => {
        mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ uploadCodeSite: uploadCodeSiteStub });
        mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
        mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
        mock(() => import("fs/promises")).with({ chmod: fake() });
        mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
      });
  }

  it("calls upload code-site", async () => {

    await callActionWithMocks();

    uploadCodeSiteStub.should.have.been.calledOnceWithExactly({
      credentials: credentials,
      environmentUrl: environmentUrl,
      rootPath: { name: 'root-path', required: true, defaultValue: undefined },
      compiledPath: { name: 'compiled-path', required: false, defaultValue: undefined },
      siteName: { name: 'site-name', required: false, defaultValue: undefined },
    }, runnerParameters, new ActionsHost());
  });
});

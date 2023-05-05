// // Copyright (c) Microsoft Corporation.
// // Licensed under the MIT License.

// import { should, use } from "chai";
// import { stubInterface } from "ts-sinon";
// import * as sinonChai from "sinon-chai";
// import rewiremock from "./rewiremock";
// import { fake, stub } from "sinon";
// import { UsernamePassword } from "@microsoft/powerplatform-cli-wrapper";
// import { runnerParameters } from "../../src/lib/runnerParameters";
// import Sinon = require("sinon");
// import { ActionsHost } from "../lib/host/ActionsHost";
// should();
// use(sinonChai);

// describe("check solution test", () => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const checkSolutionStub: Sinon.SinonStub<any[], any> = stub();
//   const credentials: UsernamePassword = stubInterface<UsernamePassword>();
//   const environmentUrl = "environment url";

//   async function callActionWithMocks(): Promise<void> {
//     await rewiremock.around(
//       () => import("../../src/actions/check-solution/index"),
//       (mock) => {
//         mock(() => import("@microsoft/powerplatform-cli-wrapper/dist/actions")).with({ checkSolution: checkSolutionStub });
//         mock(() => import("../../src/lib/auth/getCredentials")).withDefault(() => credentials );
//         mock(() => import("../../src/lib/auth/getEnvironmentUrl")).withDefault(() => environmentUrl );
//         mock(() => import("fs/promises")).with({ chmod: fake() });
//         mock(() => import("../../src/lib/runnerParameters")).with({ runnerParameters: runnerParameters });
//       });
//   }

//   it("calls check solution", async () => {

//     await callActionWithMocks();

//     checkSolutionStub.should.have.been.calledOnceWithExactly({
//       credentials: credentials,
//       environmentUrl: environmentUrl,
//       solutionPath: { name: 'path', required: true, defaultValue: undefined },
//       geoInstance: { name: 'geo', required: false, defaultValue: undefined },
//       ruleLevelOverride: { name: 'rule-level-override', required: false, defaultValue: undefined },
//       artifactStoreName: { name: 'checker-logs-artifact-name', required: false, defaultValue: undefined },
//       failOnAnalysisError: { name: "fail-on-analysis-error", required: false, defaultValue: 'true' },
//       fileLocation: { name: "fileLocation",  required: false, defaultValue: "localFiles" },
//       solutionUrl: { name: "solutionUrl",  required: false, defaultValue: "" },
//       useDefaultPAEndpoint: { name: "useDefaultPAEndpoint", required: false, defaultValue: true },
//       customPAEndpoint: { name: "customPAEndpoint", required: false, defaultValue: "https://unitedstates.api.advisor.powerapps.com/" },
//       ruleSet: { name: "ruleSet", required: false, defaultValue: "Solution Checker" },
//       errorLevel: { name: "errorLevel", required: false, defaultValue: "HighIssueCount" },
//       errorThreshold: { name: "errorThreshold", required: false, defaultValue: "0" },
//       filesExcluded: { name: "filesExcluded", required: false, defaultValue: ""}
//     }, runnerParameters, new ActionsHost('PowerAppsChecker'));
//   });
// });

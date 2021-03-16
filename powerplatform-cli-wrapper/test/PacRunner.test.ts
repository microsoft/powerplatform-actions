import { expect } from "chai";
import { createPacRunner } from "../src";
import path = require("path");
import fs = require("fs-extra");
import { createTestLog } from "./createTestLogger";

describe("PacAccess", () => {
  const workDir = path.resolve(__dirname, "..", "bin", "test");
  const pacPath = path.resolve(
    __dirname,
    "..",
    "bin",
    "pac",
    "tools",
    "pac.exe"
  );
  const pac = createPacRunner(workDir, pacPath, createTestLog("pac-tests.log"));

  before(() => {
    fs.emptyDirSync(workDir);
  });

  it("can launch pac help screen", async () => {
    const res = await pac.help();
    expect(res).to.be.not.null;
    expect(res).to.be.not.empty;
  }).timeout(10 * 1000);

  it("can list auth profiles", async () => {
    const res = await pac.auth.list();
    expect(res).to.be.not.empty;
  }).timeout(30 * 1000);
});

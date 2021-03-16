const gulp = require("gulp");
const path = require("path");
const nugetInstall = require("./lib/nugetInstall");
const binDir = require("./lib/binDir");

module.exports = gulp.series(
  async () =>
    nugetInstall(
      "nuget.org",
      "Microsoft.CrmSdk.CoreTools",
      "9.1.0.49",
      path.resolve(binDir, "sopa")
    ),
  async () =>
    nugetInstall(
      "CAP_ISVExp_Tools_Daily",
      "Microsoft.PowerApps.CLI",
      "1.5.3-daily-21021001",
      path.resolve(binDir, "pac")
    )
);

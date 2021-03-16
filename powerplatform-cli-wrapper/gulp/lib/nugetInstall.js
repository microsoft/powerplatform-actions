const log = require("fancy-log");
const fetch = require("node-fetch");
const unzip = require("unzip-stream");

module.exports = async function nugetInstall(
  nugetSource,
  packageName,
  version,
  targetDir
) {
  // https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource
  const feeds = {
    "nuget.org": {
      authenticated: false,
      baseUrl: "https://api.nuget.org/v3-flatcontainer/",
    },
    CAP_ISVExp_Tools_Daily: {
      authenticated: true,
      // https://dev.azure.com/msazure/One/_packaging?_a=feed&feed=CAP_ISVExp_Tools_Daily
      baseUrl:
        "https://pkgs.dev.azure.com/msazure/_packaging/d3fb5788-d047-47f9-9aba-76890f5cecf0/nuget/v3/flat2/",
    },
  };

  const selectedFeed = feeds[nugetSource];
  const baseUrl = selectedFeed.baseUrl;

  packageName = packageName.toLowerCase();
  version = version.toLowerCase();
  const packagePath = `${packageName}/${version}/${packageName}.${version}.nupkg`;

  const nupkgUrl = new URL(packagePath, baseUrl);
  const reqInit = {
    headers: {
      "User-Agent": "gulpfile-DAP-team/0.1",
      Accept: "*/*",
    },
    redirect: "manual",
  };
  if (selectedFeed.authenticated) {
    const readPAT = process.env["AZ_DevOps_Read_PAT"];
    if (!readPAT) {
      throw new Error(
        `nuget feed ${nugetSource} requires authN but env var 'AZ_DevOps_Read_PAT' was not defined!`
      );
    }
    reqInit.headers["Authorization"] = `Basic ${Buffer.from(
      "PAT:" + readPAT
    ).toString("base64")}`;
  }

  log.info(`Downloading package: ${nupkgUrl}...`);
  let res = await fetch(nupkgUrl, reqInit);
  if (res.status === 303) {
    const location = res.headers.get("location");
    const url = new URL(location);
    log.info(` ... redirecting to: ${url.origin}${url.pathname}}...`);
    // AzDevOps feeds will redirect to Azure storage with location url w/ SAS token: on 2nd request drop authZ header
    delete reqInit.headers["Authorization"];
    res = await fetch(location, reqInit);
  }
  if (!res.ok) {
    throw new Error(
      `Cannot download ${res.url}, status: ${res.statusText} (${
        res.status
      }), body: ${res.body.read().toString("ascii")}`
    );
  }

  log.info(`Extracting into folder: ${targetDir}`);
  return new Promise((resolve, reject) => {
    res.body
      .pipe(unzip.Extract({ path: targetDir }))
      .on("close", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

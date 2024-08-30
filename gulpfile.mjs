// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
"use strict";
import dotenv from 'dotenv';
dotenv.config();

import gulp from 'gulp';
import esbuild from 'esbuild';
import eslint from 'gulp-eslint-new';
import mocha from 'gulp-mocha';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';

import fetch from 'node-fetch';
import fs from 'fs-extra';
import log from 'fancy-log';
import path from'path';
import pslist from 'ps-list';
import unzip from 'unzip-stream';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import util from 'util';

import childProcess from 'child_process';
const exec = util.promisify(childProcess.exec);

import yargs from 'yargs';
const argv = yargs(process.argv.slice(2)).argv; // skip 'node' and 'gulp.js' args

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const tsConfigFile = './tsconfig.json';
const tsconfig = require(tsConfigFile);
const PacInfo = require('./src/pacPackageInfo.json');

const outdir = path.resolve(tsconfig.compilerOptions.outDir);
const distdir = path.resolve('./dist');

const feedPAT = argv.feedPAT || process.env['AZ_DevOps_Read_PAT'];

// list actions (by their name) that are not to be added to the release (test or pre-release actions):
const skippedActionYamls = [ 'data', 'install-application' ];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clean() {
    (await pslist())
        .filter((info) => info.name.startsWith('pacTelemetryUpload'))
        .forEach(info => {
            log.info(`Terminating: ${info.name} - ${info.pid}...`)
            process.kill(info.pid);
        });
    return fs.emptyDir(outdir);
}

function compile() {
    fs.copyFileSync('src/pacPackageInfo.json', path.resolve(outdir, 'pacPackageInfo.json'));
    const tsProj = ts.createProject(tsConfigFile);
    return gulp
        .src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProj())
        // https://www.npmjs.com/package/gulp-typescript#source-maps
        .pipe(sourcemaps.write('./', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest(outdir));
}

async function nugetInstall(nugetSource, packageName, version, targetDir) {
    // https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource
    const feeds = {
        'nuget.org': {
            authenticated: false,
            baseUrl: 'https://api.nuget.org/v3-flatcontainer/'
        },
        'CAP_ISVExp_Tools_Daily': {
            authenticated: true,
            // https://dev.azure.com/msazure/One/_packaging?_a=feed&feed=CAP_ISVExp_Tools_Daily
            baseUrl: 'https://pkgs.dev.azure.com/msazure/_packaging/d3fb5788-d047-47f9-9aba-76890f5cecf0/nuget/v3/flat2/'
        },
        'CAP_ISVExp_Tools_Stable': {
            authenticated: true,
            // https://dev.azure.com/msazure/One/_packaging?_a=feed&feed=CAP_ISVExp_Tools_Daily
            baseUrl: 'https://pkgs.dev.azure.com/msazure/_packaging/b0441cf8-0bc8-4fad-b126-841a6184e784/nuget/v3/flat2/'
        },
        'DPX-Tools-Upstream' : {
            authenticated: true,
            // https://dev.azure.com/dynamicscrm/OneCRM/_artifacts/feed/DPX-Tools-Upstream
            baseUrl: "https://pkgs.dev.azure.com/dynamicscrm/OneCRM/_packaging/1b55351d-c15e-45b3-9454-70a9549af804/nuget/v3/flat2/"
        },
        'PowerPortalPackages': {
            authenticated: true,
            // https://dynamicscrm.visualstudio.com/DefaultCollection/OneCRM/_packaging?_a=feed&feed=PowerPortalPackages
            baseUrl: 'https://pkgs.dev.azure.com/dynamicscrm/b276c3e1-2902-46bd-a686-484157b97f48/_packaging/63f896c0-b555-4017-a932-9063f2e7487e/nuget/v3/flat2/'
        },
    }

    // Override the feed used if specified by the --useFeed argument
    const selectedFeedName = argv.useFeed || nugetSource;

    const selectedFeed = feeds[selectedFeedName];
    const baseUrl = selectedFeed.baseUrl;

    packageName = packageName.toLowerCase();
    version = version.toLowerCase();
    const packagePath = `${packageName}/${version}/${packageName}.${version}.nupkg`;

    const nupkgUrl = new URL(packagePath, baseUrl);
    const reqInit = {
        headers: {
            'User-Agent': 'gulpfile-DAP-team/0.1',
            'Accept': '*/*'
        },
        redirect: 'manual'
    };
    if (selectedFeed.authenticated) {
        if (!feedPAT) {
            throw new Error(`nuget feed ${nugetSource} requires authN but neither '--feedPAT' argument nor env var 'AZ_DevOps_Read_PAT' was defined!`);
        }
        reqInit.headers['Authorization'] = `Basic ${Buffer.from('PAT:' + feedPAT).toString('base64')}`;
    }

    log.info(`Downloading package: ${nupkgUrl}...`);
    let res = await fetch(nupkgUrl, reqInit);
    if (res.status === 303) {
        const location = res.headers.get('location');
        const url = new URL(location);
        log.info(` ... redirecting to: ${url.origin}${url.pathname}}...`);
        // AzDevOps feeds will redirect to Azure storage with location url w/ SAS token: on 2nd request drop authZ header
        delete reqInit.headers['Authorization'];
        res = await fetch(location, reqInit);
    }
    if (!res.ok) {
        const body = res.body.read();
        throw new Error(`Cannot download ${res.url}, status: ${res.statusText} (${res.status}), body: ${body ? body.toString('ascii') : 'null'}`);
    }

    log.info(`Extracting into folder: ${targetDir}`);
    return new Promise((resolve, reject) => {
        res.body.pipe(unzip.Extract({ path: targetDir }))
            .on('close', () => {
                resolve();
            }).on('error', err => {
                reject(err);
            })
    });
}

function lint() {
    return gulp
        .src('src/**/*.ts')
        .pipe(eslint())
        .pipe(eslint.format());
}

function test() {
    return gulp
        .src('src/test/**/*.ts', { read: false })
        .pipe(mocha({
                require: [ "ts-node/register" ],
                ui: 'bdd'
            }))
        .pipe(eslint.format());
}

async function dist() {
    fs.emptyDirSync(distdir);

    glob.sync('**/action.yml', {
            cwd: __dirname
        })
    // ignore the toplevel action.yml that is needed for GH Marketplace
    .filter(actionYaml => path.dirname(actionYaml) !== '.')
    .map(actionYaml => path.basename(path.dirname(actionYaml)))
    .filter(actionName => !skippedActionYamls.includes(actionName))
    .map((actionName, idx) => {
        const actionPath = path.join('actions', actionName);
        const actionDistDir = path.resolve(distdir, actionPath);
        log.info(`package action ${idx} "${actionName}" into ./dist folder (${actionDistDir})...`);
        esbuild.buildSync({
            bundle: true,
            entryPoints: [ path.resolve(outdir, actionPath, 'index.js') ],
            outfile: path.join(actionDistDir, 'index.js'),
            platform: 'node',
        });
    });
}

// Unzipping the pac program from the nuget package does not set the
// Execute flag on non-Windows platforms.  Thus, we need to set it ourselves.
async function setExecuteFlag(path, updateIndex) {
    // chmod sets the execute flag on the filesystem, but is a no-op on windows
    fs.chmodSync(path, 0o711);
    if (updateIndex) {
        // Git tracks the execute flag as well, so make sure we set that *esepcially* on Windows
        await exec("git update-index --info-only --chmod=+x " + path);
    }
}

async function addDistToIndex() {
    const res = await exec(`git add -f -- ${distdir}`);
    console.log(`stdout: ${res.stdout}`);
    console.log(`stderr: ${res.stderr}`);
}

async function nugetInstallPortalPackages() {
    const packageName = "CDSStarterPortal"
    const packageNameToImport = `Adxstudio.${packageName}`
    const downloadDir = path.resolve(outdir, 'temp_portal_package', 'download');
    const downloadedZipFile = path.resolve(downloadDir,`${packageName}.zip`);
    const portalPackageOutDir = path.resolve(outdir , 'portal_package')

    await nugetInstall('PowerPortalPackages', 'cdsstarterportal', '9.2.2103.21', downloadDir );

    return new Promise((resolve, reject) => {
        fs.createReadStream(downloadedZipFile)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            var filePath = entry.path;
            if (filePath === `${packageNameToImport}.zip`) {
                entry.pipe(unzip.Extract({ path: portalPackageOutDir}))
                .on('close', () => {
                    log.info(`Extracted portal package to ${portalPackageOutDir} `);
                    fs.rmdirSync(path.resolve(outdir, 'temp_portal_package'), { recursive: true })
                    resolve();
                }).on('error', err => {
                    reject(err);
                })
            } else {
                entry.autodrain();
            }
        })
    });
}

async function nugetInstallLinux() {
    await nugetInstall('nuget.org', PacInfo.LegacyLinuxPackage, PacInfo.PacPackageVersion, path.resolve(outdir, 'pac_linux'));
    await setExecuteFlag(path.resolve(outdir, 'pac_linux', 'tools', 'pac'));
}

async function nugetInstallWindows() {
    await nugetInstall('nuget.org', PacInfo.PacPackageName, PacInfo.PacPackageVersion, path.resolve(outdir, 'pac'));
}

async function restore() {
    await clean();
    await nugetInstallLinux();
    await nugetInstallWindows();
}

async function fetchPortalPackage() {
    await nugetInstallPortalPackages()
}

const recompile = gulp.series(
    restore,
    compile,
);

const ci = gulp.series(
    restore,
    compile,
    lint,
    test
);

const updateDist = gulp.series(
    restore,
    compile,
    dist,
    addDistToIndex,
);

export {
    clean,
    restore,
    compile,
    recompile,
    lint,
    test,
    ci,
    dist,
    updateDist,
    addDistToIndex,
    fetchPortalPackage,
    recompile as default,
};

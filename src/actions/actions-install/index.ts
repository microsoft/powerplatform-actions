// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io'
import * as os from "node:os";
import { resolve } from 'node:path';
import * as fs from 'node:fs/promises';
import * as path from 'node:path'
import { ActionLogger } from '../../lib/actionLogger';
import * as PacInfo from "../../pacPackageInfo.json";
import { PacInstalledEnvVarName, PacPathEnvVarName } from '../../lib/runnerParameters';

const argName = {
    versionOverride: 'pac-version-override',
    nugetFeedOverride: 'nuget-feed-override',
    nugetFeedUsername: 'nuget-feed-username',
    nugetFeedPassword: 'nuget-feed-password',
    localPacPath: 'use-preinstalled-pac'
};

class MutuallyExclusiveArgsError extends Error {
    constructor(argument1: string, argument2: string) {
        super(`Cannot specify both ${argument1} and ${argument2}.`);
    }
}

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    const logger = new ActionLogger();
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main(): Promise<void> {
    core.startGroup('actions-install:');

    const args = {
        versionOverride: core.getInput(argName.versionOverride, { required: false }),
        nugetFeedOverride: core.getInput(argName.nugetFeedOverride, { required: false }),
        nugetFeedUsername: core.getInput(argName.nugetFeedUsername, { required: false }),
        nugetFeedPassword: core.getInput(argName.nugetFeedPassword, { required: false }),
        localPacPath: core.getInput(argName.localPacPath, { required: false })
    };

    // Let the Actions runner know to mask secrets if they appear in logs or console output
    args.nugetFeedPassword && core.setSecret(args.nugetFeedPassword);

    // Argument Validation, as many of these are mutually exclusive
    if (args.localPacPath && args.nugetFeedOverride) throw new MutuallyExclusiveArgsError(argName.localPacPath, argName.nugetFeedOverride);
    if (args.localPacPath && args.versionOverride) throw new MutuallyExclusiveArgsError(argName.localPacPath, argName.versionOverride);

    if (args.nugetFeedPassword && !args.nugetFeedOverride) {
        throw new Error(`Do not provide Authentication args (${argName.nugetFeedPassword}) without providing a feed which requires authentication via ${argName.nugetFeedOverride}.`);
    }
    if ((args.nugetFeedPassword && !args.nugetFeedUsername) || (!args.nugetFeedPassword && args.nugetFeedUsername)) {
        throw new Error(`Cannot specify ${argName.nugetFeedPassword} or ${argName.nugetFeedUsername} without the other.`);
    }

    if (args.versionOverride && args.versionOverride !== PacInfo.PacPackageVersion) {
        core.warning(`Actions built targetting PAC ${PacInfo.PacPackageVersion}, so Action and PAC parameters might not match with requested version ${args.versionOverride}.`);
    }

    if (process.env[PacInstalledEnvVarName] === 'true') {
        core.warning('PAC is already installed. Skipping installation.');
        core.endGroup();
        return;
    }

    const packageVersion = args.versionOverride || PacInfo.PacPackageVersion;

    if (args.localPacPath) {
        await usingPreinstalledPac(args.localPacPath);
    } else if (os.platform() === 'win32') {
        await nugetInstall(PacInfo.PacPackageName, packageVersion, args.nugetFeedOverride, args.nugetFeedUsername, args.nugetFeedPassword);
    } else {
        await dotnetInstall(PacInfo.DotnetToolName, packageVersion, args.nugetFeedOverride, args.nugetFeedUsername, args.nugetFeedPassword);
    }

    core.endGroup();
}

async function usingPreinstalledPac(localPacPath: string): Promise<void> {
    const absolutePath = path.resolve(localPacPath);
    core.info(`Using preinstalled pac from ${absolutePath}`)

    // Check that the path exists and is executable
    await fs.access(absolutePath, fs.constants.X_OK).catch(() => {
        throw new Error(`The path ${absolutePath} does not exist or is not executable.`);
    });

    if (os.platform() === 'win32' && !absolutePath.endsWith('pac.exe')) {
        throw new Error(`The path ${absolutePath} does point at the expected 'pac.exe'.`);
    } else if (os.platform() !== 'win32' && !absolutePath.endsWith('pac')) {
        throw new Error(`The path ${absolutePath} does point at the expected 'pac'.`);
    }

    core.exportVariable(PacInstalledEnvVarName, 'true');
    core.exportVariable(PacPathEnvVarName, absolutePath);
    core.addPath(absolutePath);
    core.warning(`Actions built targetting PAC ${PacInfo.PacPackageVersion}, so Action and PAC parameters might not match if preinstalled pac is a different version.`);
}

async function nugetInstall(packageName: string, packageVersion: string, nugetFeedOverride: string, nugetFeedUsername: string, nugetFeedPassword: string): Promise<void> {
    core.info(`Installing ${packageName}.${packageVersion} via nuget.exe`);

    await checkForInstallationTool('nuget');

    const toolpath = await fs.mkdtemp(path.join(os.tmpdir(), 'powerplatform-actions-'));
    let nugetConfigFile: string | undefined = undefined;

    try {
        if (nugetFeedOverride && nugetFeedOverride !== 'https://api.nuget.org/v3/index.json') {
            nugetConfigFile = await createNugetConfigViaNuget(toolpath, nugetFeedOverride, nugetFeedUsername, nugetFeedPassword);
        }

        const installArgs = ['install', packageName,
            '-Version', packageVersion,
            '-DependencyVersion', 'ignore', // There are no dependencies, so don't waste that time checking
            '-NonInteractive',
            '-OutputDirectory', toolpath];
        nugetConfigFile && installArgs.push('-ConfigFile', nugetConfigFile);

        await exec.getExecOutput('nuget', installArgs);

        const pacPath = resolve(toolpath, packageName + '.' + packageVersion, 'tools', 'pac.exe');
        core.exportVariable(PacInstalledEnvVarName, 'true');
        core.exportVariable(PacPathEnvVarName, pacPath);
        core.addPath(pacPath);
    } finally {
        if (nugetConfigFile) {
            await fs.rm(nugetConfigFile);
        }
    }
}

async function dotnetInstall(packageName: string, packageVersion: string, nugetFeedOverride: string, nugetFeedUsername: string, nugetFeedPassword: string): Promise<void> {
    core.info(`Installing ${packageName}.${packageVersion} via dotnet tool install`);

    await checkForInstallationTool('dotnet');

    const toolpath = await fs.mkdtemp(path.join(os.tmpdir(), 'powerplatform-actions-'));
    let nugetConfigFile: string | undefined = undefined;

    try {
        if (nugetFeedOverride && nugetFeedOverride !== 'https://api.nuget.org/v3/index.json') {
            nugetConfigFile = await createNugetConfigViaDotnet(toolpath, nugetFeedOverride, nugetFeedUsername, nugetFeedPassword);
        }

        const installArgs = ['tool', 'install', packageName, '--version', packageVersion, '--tool-path', toolpath];
        nugetConfigFile && installArgs.push('--configfile', nugetConfigFile);
        await exec.getExecOutput('dotnet', installArgs);

        core.exportVariable(PacInstalledEnvVarName, 'true');
        const pacPath = path.join(toolpath, os.platform() === 'win32' ? 'pac.exe' : 'pac');
        core.exportVariable(PacPathEnvVarName, pacPath);
        core.addPath(pacPath);
        core.info(`pac installed to ${process.env[PacPathEnvVarName]}`);
    } finally {
        if (nugetConfigFile) {
            // Clean up the nuget config we wrote, as Linux and macOS don't support encrypted credentials,
            await fs.rm(nugetConfigFile);
        }
    }
}

async function createNugetConfigViaNuget(toolDirectory: string, nugetFeedOverride: string, nugetFeedUsername: string, nugetFeedPassword: string): Promise<string> {
    core.info(`Adding nuget feed ${nugetFeedOverride} to nuget sources`);

    const filename = path.resolve(toolDirectory, 'nuget.config');
    await fs.writeFile(filename, `<?xml version="1.0" encoding="utf-8"?><configuration></configuration>`);

    const configArgs = ['sources', 'add', '-name', 'pacNugetFeed', '-source', nugetFeedOverride, `-ConfigFile`, filename];
    nugetFeedUsername && configArgs.push('-username', nugetFeedUsername);
    nugetFeedPassword && configArgs.push('-password', nugetFeedPassword);

    await exec.getExecOutput('nuget', configArgs);

    return filename;
}

async function createNugetConfigViaDotnet(toolDirectory: string, nugetFeedOverride: string, nugetFeedUsername: string, nugetFeedPassword: string): Promise<string> {
    core.info(`Adding nuget feed ${nugetFeedOverride} to dotnet nuget sources`);

    const filename = path.resolve(toolDirectory, 'nuget.config');
    await exec.getExecOutput('dotnet', ['new', 'nugetconfig', '-o', toolDirectory]);
    await exec.getExecOutput('dotnet', ['nuget', 'remove', 'source', 'nuget', '--configfile', filename]);

    const nugetSourceArgs = ['nuget', 'add', 'source', nugetFeedOverride, '--name', 'pacNugetFeed', '--configfile', filename ];
    nugetFeedUsername && nugetSourceArgs.push('--username', nugetFeedUsername);
    nugetFeedPassword && nugetSourceArgs.push('--password', nugetFeedPassword);

    if (os.platform() !== 'win32') {
        // Encrypted credentials are not supported on Linux or macOS.  Clean up file in Finally block.
        nugetSourceArgs.push('--store-password-in-clear-text');
    }

    await exec.getExecOutput('dotnet', nugetSourceArgs);

    return filename;
}

async function checkForInstallationTool(toolName: string): Promise<void> {
    try {
        await io.which(toolName, true);
    } catch (error) {
        throw new Error(`Runner does not have prerequisite "${toolName}" installed, as it was not found in the PATH.`);
    }
}

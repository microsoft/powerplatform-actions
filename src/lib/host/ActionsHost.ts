import fs = require("fs-extra");
import path = require("path");
import os = require("os");
import unzip = require('unzip-stream');
import * as core from '@actions/core';
import { DefaultArtifactClient } from '@actions/artifact'
import { HostParameterEntry, IHostAbstractions } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import { IArtifactStore } from "@microsoft/powerplatform-cli-wrapper/dist/host/IArtifactStore";
import ActionsLogger from "./ActionsLogger";

export class ActionsHost implements IHostAbstractions {
  name = "GitHub-Actions";
  private _artifactStoreName: string;

  public constructor(artifactStoreName?: string) {
    this._artifactStoreName = artifactStoreName || 'artifacts';
  }

  public getInput(entry: HostParameterEntry): string | undefined {
    const value = core.getInput(entry.name, { required: entry.required });
    // normalize value to always be undefined if the user has not declared the input value
    return (value && value.trim() !== '') ? value : undefined;
  }

  public getArtifactStore(): IArtifactStore {
    return new ActionsArtifactStore(this._artifactStoreName);
  }
}

class ActionsArtifactStore implements IArtifactStore {
  private readonly _subFolder
  private _resultsDirectory: string;

  constructor(subFolder: string) {
    this._subFolder = subFolder;
    this._resultsDirectory = os.tmpdir();
  }

  getTempFolder(): string {
    const outputDirectory = this.getOutputDirectory();
    this._resultsDirectory = path.join(outputDirectory, 'results');
    ActionsLogger.debug(`Artifact directory: ${outputDirectory}`);
    return outputDirectory;
  }

  public async upload(artifactName: string, files: string[]): Promise<void> {
    ActionsLogger.debug(`files: ${files.join(';')}`);
    await fs.emptyDir(this._resultsDirectory);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === '.zip') {
        ActionsLogger.debug(`unzipping ${file} into ${this._resultsDirectory} ...`);
        await extractToFolder(file, this._resultsDirectory);
      } else {
        ActionsLogger.debug(`copying ${file} into ${this._resultsDirectory} ...`);
        await fs.copyFile(file, path.join(this._resultsDirectory, path.basename(file)));
      }
    }

    const client = new DefaultArtifactClient()

    // pipeline has no artifact store (e.g. release pipelines):
    const resultFiles = (await fs.readdir(this._resultsDirectory))
        .map(f => path.resolve(this._resultsDirectory, f)); // .uploadArtifacts insists on FQN files
    if (resultFiles.length > 0) {
      client.uploadArtifact(artifactName, resultFiles, this._resultsDirectory, { });
    } else {
        ActionsLogger.warn(`Found no result files`);
    }
  }

  // https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
  private getOutputDirectory(): string {
    let baseOutDir: string;
    if (process.env.RUNNER_TEMP) {
      baseOutDir = process.env.RUNNER_TEMP;
    } else if (process.env.GITHUB_WORKSPACE) {
      baseOutDir = process.env.GITHUB_WORKSPACE;
    } else {
      baseOutDir = path.join(process.cwd(), 'out');
    }
    const outputDirectory = path.join(baseOutDir, this._subFolder);
    fs.emptyDirSync(outputDirectory);
    return outputDirectory;
  }

}

async function extractToFolder(zipFile: string, outDirectory: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipFile)
      .pipe(unzip.Extract({ path: outDirectory }))
      .on("close", () => {
        resolve(outDirectory);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}


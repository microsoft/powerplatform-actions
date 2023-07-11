"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAfterActionTraceEventForStep = createAfterActionTraceEventForStep;
exports.createBeforeActionTraceEventForStep = createBeforeActionTraceEventForStep;
exports.mergeTraceFiles = mergeTraceFiles;
exports.saveTraceFile = saveTraceFile;
exports.serializeClientSideCallMetadata = serializeClientSideCallMetadata;
var _fs = _interopRequireDefault(require("fs"));
var _zipBundle = require("../zipBundle");
var _manualPromise = require("./manualPromise");
var _crypto = require("./crypto");
var _time = require("./time");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function serializeClientSideCallMetadata(metadatas) {
  const fileNames = new Map();
  const stacks = [];
  for (const m of metadatas) {
    if (!m.stack || !m.stack.length) continue;
    const stack = [];
    for (const frame of m.stack) {
      let ordinal = fileNames.get(frame.file);
      if (typeof ordinal !== 'number') {
        ordinal = fileNames.size;
        fileNames.set(frame.file, ordinal);
      }
      const stackFrame = [ordinal, frame.line || 0, frame.column || 0, frame.function || ''];
      stack.push(stackFrame);
    }
    stacks.push([m.id, stack]);
  }
  return {
    files: [...fileNames.keys()],
    stacks
  };
}
async function mergeTraceFiles(fileName, temporaryTraceFiles) {
  if (temporaryTraceFiles.length === 1) {
    await _fs.default.promises.rename(temporaryTraceFiles[0], fileName);
    return;
  }
  const mergePromise = new _manualPromise.ManualPromise();
  const zipFile = new _zipBundle.yazl.ZipFile();
  const entryNames = new Set();
  zipFile.on('error', error => mergePromise.reject(error));
  for (let i = 0; i < temporaryTraceFiles.length; ++i) {
    const tempFile = temporaryTraceFiles[i];
    const promise = new _manualPromise.ManualPromise();
    _zipBundle.yauzl.open(tempFile, (err, inZipFile) => {
      if (err) {
        promise.reject(err);
        return;
      }
      let pendingEntries = inZipFile.entryCount;
      inZipFile.on('entry', entry => {
        let entryName = entry.fileName;
        if (entry.fileName.match(/[\d-]*trace./)) entryName = i + '-' + entry.fileName;
        inZipFile.openReadStream(entry, (err, readStream) => {
          if (err) {
            promise.reject(err);
            return;
          }
          if (!entryNames.has(entryName)) {
            entryNames.add(entryName);
            zipFile.addReadStream(readStream, entryName);
          }
          if (--pendingEntries === 0) promise.resolve();
        });
      });
    });
    await promise;
  }
  zipFile.end(undefined, () => {
    zipFile.outputStream.pipe(_fs.default.createWriteStream(fileName)).on('close', () => {
      Promise.all(temporaryTraceFiles.map(tempFile => _fs.default.promises.unlink(tempFile))).then(() => {
        mergePromise.resolve();
      });
    });
  });
  await mergePromise;
}
async function saveTraceFile(fileName, traceEvents, saveSources) {
  const zipFile = new _zipBundle.yazl.ZipFile();
  if (saveSources) {
    const sourceFiles = new Set();
    for (const event of traceEvents) {
      if (event.type === 'before') {
        for (const frame of event.stack || []) sourceFiles.add(frame.file);
      }
    }
    for (const sourceFile of sourceFiles) {
      await _fs.default.promises.readFile(sourceFile, 'utf8').then(source => {
        zipFile.addBuffer(Buffer.from(source), 'resources/src@' + (0, _crypto.calculateSha1)(sourceFile) + '.txt');
      }).catch(() => {});
    }
  }
  const sha1s = new Set();
  for (const event of traceEvents.filter(e => e.type === 'after')) {
    for (const attachment of event.attachments || []) {
      let contentPromise;
      if (attachment.path) contentPromise = _fs.default.promises.readFile(attachment.path);else if (attachment.base64) contentPromise = Promise.resolve(Buffer.from(attachment.base64, 'base64'));
      if (!contentPromise) continue;
      const content = await contentPromise;
      const sha1 = (0, _crypto.calculateSha1)(content);
      attachment.sha1 = sha1;
      delete attachment.path;
      delete attachment.base64;
      if (sha1s.has(sha1)) continue;
      sha1s.add(sha1);
      zipFile.addBuffer(content, 'resources/' + sha1);
    }
  }
  const traceContent = Buffer.from(traceEvents.map(e => JSON.stringify(e)).join('\n'));
  zipFile.addBuffer(traceContent, 'trace.trace');
  await new Promise(f => {
    zipFile.end(undefined, () => {
      zipFile.outputStream.pipe(_fs.default.createWriteStream(fileName)).on('close', f);
    });
  });
}
function createBeforeActionTraceEventForStep(callId, parentId, apiName, params, wallTime, stack) {
  return {
    type: 'before',
    callId,
    parentId,
    wallTime,
    startTime: (0, _time.monotonicTime)(),
    class: 'Test',
    method: 'step',
    apiName,
    params: Object.fromEntries(Object.entries(params || {}).map(([name, value]) => [name, generatePreview(value)])),
    stack
  };
}
function createAfterActionTraceEventForStep(callId, attachments, error) {
  return {
    type: 'after',
    callId,
    endTime: (0, _time.monotonicTime)(),
    log: [],
    attachments,
    error
  };
}
function generatePreview(value, visited = new Set()) {
  if (visited.has(value)) return '';
  visited.add(value);
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return '[' + value.map(v => generatePreview(v, visited)).join(', ') + ']';
  if (typeof value === 'object') return 'Object';
  return String(value);
}
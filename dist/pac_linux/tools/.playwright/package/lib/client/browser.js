"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Browser = void 0;
var _browserContext = require("./browserContext");
var _channelOwner = require("./channelOwner");
var _events = require("./events");
var _errors = require("../common/errors");
var _cdpSession = require("./cdpSession");
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

class Browser extends _channelOwner.ChannelOwner {
  // Used from @playwright/test fixtures.

  static from(browser) {
    return browser._object;
  }
  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer);
    this._contexts = new Set();
    this._isConnected = true;
    this._closedPromise = void 0;
    this._shouldCloseConnectionOnClose = false;
    this._browserType = void 0;
    this._options = {};
    this._name = void 0;
    this._connectHeaders = void 0;
    this._name = initializer.name;
    this._channel.on('close', () => this._didClose());
    this._closedPromise = new Promise(f => this.once(_events.Events.Browser.Disconnected, f));
  }
  browserType() {
    return this._browserType;
  }
  async newContext(options = {}) {
    return await this._innerNewContext(options, false);
  }
  async _newContextForReuse(options = {}) {
    return await this._wrapApiCall(async () => {
      for (const context of this._contexts) {
        await this._browserType._willCloseContext(context);
        for (const page of context.pages()) page._onClose();
        context._onClose();
      }
      return await this._innerNewContext(options, true);
    }, true);
  }
  async _innerNewContext(options = {}, forReuse) {
    options = {
      ...this._browserType._defaultContextOptions,
      ...options
    };
    const contextOptions = await (0, _browserContext.prepareBrowserContextParams)(options);
    const response = forReuse ? await this._channel.newContextForReuse(contextOptions) : await this._channel.newContext(contextOptions);
    const context = _browserContext.BrowserContext.from(response.context);
    await this._browserType._didCreateContext(context, contextOptions, this._options, options.logger || this._logger);
    return context;
  }
  contexts() {
    return [...this._contexts];
  }
  version() {
    return this._initializer.version;
  }
  async newPage(options = {}) {
    return await this._wrapApiCall(async () => {
      const context = await this.newContext(options);
      const page = await context.newPage();
      page._ownedContext = context;
      context._ownerPage = page;
      return page;
    });
  }
  isConnected() {
    return this._isConnected;
  }
  async newBrowserCDPSession() {
    return _cdpSession.CDPSession.from((await this._channel.newBrowserCDPSession()).session);
  }
  async startTracing(page, options = {}) {
    await this._channel.startTracing({
      ...options,
      page: page ? page._channel : undefined
    });
  }
  async stopTracing() {
    return (await this._channel.stopTracing()).binary;
  }
  async close() {
    try {
      if (this._shouldCloseConnectionOnClose) this._connection.close(_errors.kBrowserClosedError);else await this._channel.close();
      await this._closedPromise;
    } catch (e) {
      if ((0, _errors.isSafeCloseError)(e)) return;
      throw e;
    }
  }
  _didClose() {
    this._isConnected = false;
    this.emit(_events.Events.Browser.Disconnected, this);
  }
}
exports.Browser = Browser;
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@actions/core/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toCommandProperties = exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
    function toCommandProperties(annotationProperties) {
      if (!Object.keys(annotationProperties).length) {
        return {};
      }
      return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
      };
    }
    exports2.toCommandProperties = toCommandProperties;
  }
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS({
  "node_modules/@actions/core/lib/command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issue = exports2.issueCommand = void 0;
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os.EOL);
    }
    exports2.issueCommand = issueCommand;
    function issue(name, message = "") {
      issueCommand(name, {}, message);
    }
    exports2.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = "missing.command";
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS({
  "node_modules/@actions/core/lib/file-command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issueCommand = void 0;
    var fs = __importStar(require("fs"));
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: "utf8"
      });
    }
    exports2.issueCommand = issueCommand;
  }
});

// node_modules/@actions/http-client/proxy.js
var require_proxy = __commonJS({
  "node_modules/@actions/http-client/proxy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function getProxyUrl(reqUrl) {
      let usingSsl = reqUrl.protocol === "https:";
      let proxyUrl;
      if (checkBypass(reqUrl)) {
        return proxyUrl;
      }
      let proxyVar;
      if (usingSsl) {
        proxyVar = process.env["https_proxy"] || process.env["HTTPS_PROXY"];
      } else {
        proxyVar = process.env["http_proxy"] || process.env["HTTP_PROXY"];
      }
      if (proxyVar) {
        proxyUrl = new URL(proxyVar);
      }
      return proxyUrl;
    }
    exports2.getProxyUrl = getProxyUrl;
    function checkBypass(reqUrl) {
      if (!reqUrl.hostname) {
        return false;
      }
      let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
      if (!noProxy) {
        return false;
      }
      let reqPort;
      if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
      } else if (reqUrl.protocol === "http:") {
        reqPort = 80;
      } else if (reqUrl.protocol === "https:") {
        reqPort = 443;
      }
      let upperReqHosts = [reqUrl.hostname.toUpperCase()];
      if (typeof reqPort === "number") {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
      }
      for (let upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x)) {
        if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
          return true;
        }
      }
      return false;
    }
    exports2.checkBypass = checkBypass;
  }
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS({
  "node_modules/tunnel/lib/tunnel.js"(exports2) {
    "use strict";
    var net = require("net");
    var tls = require("tls");
    var http = require("http");
    var https = require("https");
    var events = require("events");
    var assert = require("assert");
    var util = require("util");
    exports2.httpOverHttp = httpOverHttp;
    exports2.httpsOverHttp = httpsOverHttp;
    exports2.httpOverHttps = httpOverHttps;
    exports2.httpsOverHttps = httpsOverHttps;
    function httpOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      return agent;
    }
    function httpsOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function httpOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      return agent;
    }
    function httpsOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function TunnelingAgent(options) {
      var self = this;
      self.options = options || {};
      self.proxyOptions = self.options.proxy || {};
      self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
      self.requests = [];
      self.sockets = [];
      self.on("free", function onFree(socket, host, port, localAddress) {
        var options2 = toOptions(host, port, localAddress);
        for (var i = 0, len = self.requests.length; i < len; ++i) {
          var pending = self.requests[i];
          if (pending.host === options2.host && pending.port === options2.port) {
            self.requests.splice(i, 1);
            pending.request.onSocket(socket);
            return;
          }
        }
        socket.destroy();
        self.removeSocket(socket);
      });
    }
    util.inherits(TunnelingAgent, events.EventEmitter);
    TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
      var self = this;
      var options = mergeOptions({ request: req }, self.options, toOptions(host, port, localAddress));
      if (self.sockets.length >= this.maxSockets) {
        self.requests.push(options);
        return;
      }
      self.createSocket(options, function(socket) {
        socket.on("free", onFree);
        socket.on("close", onCloseOrRemove);
        socket.on("agentRemove", onCloseOrRemove);
        req.onSocket(socket);
        function onFree() {
          self.emit("free", socket, options);
        }
        function onCloseOrRemove(err) {
          self.removeSocket(socket);
          socket.removeListener("free", onFree);
          socket.removeListener("close", onCloseOrRemove);
          socket.removeListener("agentRemove", onCloseOrRemove);
        }
      });
    };
    TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
      var self = this;
      var placeholder = {};
      self.sockets.push(placeholder);
      var connectOptions = mergeOptions({}, self.proxyOptions, {
        method: "CONNECT",
        path: options.host + ":" + options.port,
        agent: false,
        headers: {
          host: options.host + ":" + options.port
        }
      });
      if (options.localAddress) {
        connectOptions.localAddress = options.localAddress;
      }
      if (connectOptions.proxyAuth) {
        connectOptions.headers = connectOptions.headers || {};
        connectOptions.headers["Proxy-Authorization"] = "Basic " + new Buffer(connectOptions.proxyAuth).toString("base64");
      }
      debug("making CONNECT request");
      var connectReq = self.request(connectOptions);
      connectReq.useChunkedEncodingByDefault = false;
      connectReq.once("response", onResponse);
      connectReq.once("upgrade", onUpgrade);
      connectReq.once("connect", onConnect);
      connectReq.once("error", onError);
      connectReq.end();
      function onResponse(res) {
        res.upgrade = true;
      }
      function onUpgrade(res, socket, head) {
        process.nextTick(function() {
          onConnect(res, socket, head);
        });
      }
      function onConnect(res, socket, head) {
        connectReq.removeAllListeners();
        socket.removeAllListeners();
        if (res.statusCode !== 200) {
          debug("tunneling socket could not be established, statusCode=%d", res.statusCode);
          socket.destroy();
          var error = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self.removeSocket(placeholder);
          return;
        }
        if (head.length > 0) {
          debug("got illegal response body from proxy");
          socket.destroy();
          var error = new Error("got illegal response body from proxy");
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self.removeSocket(placeholder);
          return;
        }
        debug("tunneling connection has established");
        self.sockets[self.sockets.indexOf(placeholder)] = socket;
        return cb(socket);
      }
      function onError(cause) {
        connectReq.removeAllListeners();
        debug("tunneling socket could not be established, cause=%s\n", cause.message, cause.stack);
        var error = new Error("tunneling socket could not be established, cause=" + cause.message);
        error.code = "ECONNRESET";
        options.request.emit("error", error);
        self.removeSocket(placeholder);
      }
    };
    TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
      var pos = this.sockets.indexOf(socket);
      if (pos === -1) {
        return;
      }
      this.sockets.splice(pos, 1);
      var pending = this.requests.shift();
      if (pending) {
        this.createSocket(pending, function(socket2) {
          pending.request.onSocket(socket2);
        });
      }
    };
    function createSecureSocket(options, cb) {
      var self = this;
      TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
        var hostHeader = options.request.getHeader("host");
        var tlsOptions = mergeOptions({}, self.options, {
          socket,
          servername: hostHeader ? hostHeader.replace(/:.*$/, "") : options.host
        });
        var secureSocket = tls.connect(0, tlsOptions);
        self.sockets[self.sockets.indexOf(socket)] = secureSocket;
        cb(secureSocket);
      });
    }
    function toOptions(host, port, localAddress) {
      if (typeof host === "string") {
        return {
          host,
          port,
          localAddress
        };
      }
      return host;
    }
    function mergeOptions(target) {
      for (var i = 1, len = arguments.length; i < len; ++i) {
        var overrides = arguments[i];
        if (typeof overrides === "object") {
          var keys = Object.keys(overrides);
          for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
            var k = keys[j];
            if (overrides[k] !== void 0) {
              target[k] = overrides[k];
            }
          }
        }
      }
      return target;
    }
    var debug;
    if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
      debug = function() {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "string") {
          args[0] = "TUNNEL: " + args[0];
        } else {
          args.unshift("TUNNEL:");
        }
        console.error.apply(console, args);
      };
    } else {
      debug = function() {
      };
    }
    exports2.debug = debug;
  }
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS({
  "node_modules/tunnel/index.js"(exports2, module2) {
    module2.exports = require_tunnel();
  }
});

// node_modules/@actions/http-client/index.js
var require_http_client = __commonJS({
  "node_modules/@actions/http-client/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var http = require("http");
    var https = require("https");
    var pm = require_proxy();
    var tunnel;
    var HttpCodes;
    (function(HttpCodes2) {
      HttpCodes2[HttpCodes2["OK"] = 200] = "OK";
      HttpCodes2[HttpCodes2["MultipleChoices"] = 300] = "MultipleChoices";
      HttpCodes2[HttpCodes2["MovedPermanently"] = 301] = "MovedPermanently";
      HttpCodes2[HttpCodes2["ResourceMoved"] = 302] = "ResourceMoved";
      HttpCodes2[HttpCodes2["SeeOther"] = 303] = "SeeOther";
      HttpCodes2[HttpCodes2["NotModified"] = 304] = "NotModified";
      HttpCodes2[HttpCodes2["UseProxy"] = 305] = "UseProxy";
      HttpCodes2[HttpCodes2["SwitchProxy"] = 306] = "SwitchProxy";
      HttpCodes2[HttpCodes2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
      HttpCodes2[HttpCodes2["PermanentRedirect"] = 308] = "PermanentRedirect";
      HttpCodes2[HttpCodes2["BadRequest"] = 400] = "BadRequest";
      HttpCodes2[HttpCodes2["Unauthorized"] = 401] = "Unauthorized";
      HttpCodes2[HttpCodes2["PaymentRequired"] = 402] = "PaymentRequired";
      HttpCodes2[HttpCodes2["Forbidden"] = 403] = "Forbidden";
      HttpCodes2[HttpCodes2["NotFound"] = 404] = "NotFound";
      HttpCodes2[HttpCodes2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
      HttpCodes2[HttpCodes2["NotAcceptable"] = 406] = "NotAcceptable";
      HttpCodes2[HttpCodes2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
      HttpCodes2[HttpCodes2["RequestTimeout"] = 408] = "RequestTimeout";
      HttpCodes2[HttpCodes2["Conflict"] = 409] = "Conflict";
      HttpCodes2[HttpCodes2["Gone"] = 410] = "Gone";
      HttpCodes2[HttpCodes2["TooManyRequests"] = 429] = "TooManyRequests";
      HttpCodes2[HttpCodes2["InternalServerError"] = 500] = "InternalServerError";
      HttpCodes2[HttpCodes2["NotImplemented"] = 501] = "NotImplemented";
      HttpCodes2[HttpCodes2["BadGateway"] = 502] = "BadGateway";
      HttpCodes2[HttpCodes2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
      HttpCodes2[HttpCodes2["GatewayTimeout"] = 504] = "GatewayTimeout";
    })(HttpCodes = exports2.HttpCodes || (exports2.HttpCodes = {}));
    var Headers;
    (function(Headers2) {
      Headers2["Accept"] = "accept";
      Headers2["ContentType"] = "content-type";
    })(Headers = exports2.Headers || (exports2.Headers = {}));
    var MediaTypes;
    (function(MediaTypes2) {
      MediaTypes2["ApplicationJson"] = "application/json";
    })(MediaTypes = exports2.MediaTypes || (exports2.MediaTypes = {}));
    function getProxyUrl(serverUrl) {
      let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
      return proxyUrl ? proxyUrl.href : "";
    }
    exports2.getProxyUrl = getProxyUrl;
    var HttpRedirectCodes = [
      HttpCodes.MovedPermanently,
      HttpCodes.ResourceMoved,
      HttpCodes.SeeOther,
      HttpCodes.TemporaryRedirect,
      HttpCodes.PermanentRedirect
    ];
    var HttpResponseRetryCodes = [
      HttpCodes.BadGateway,
      HttpCodes.ServiceUnavailable,
      HttpCodes.GatewayTimeout
    ];
    var RetryableHttpVerbs = ["OPTIONS", "GET", "DELETE", "HEAD"];
    var ExponentialBackoffCeiling = 10;
    var ExponentialBackoffTimeSlice = 5;
    var HttpClientError = class extends Error {
      constructor(message, statusCode) {
        super(message);
        this.name = "HttpClientError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }
    };
    exports2.HttpClientError = HttpClientError;
    var HttpClientResponse = class {
      constructor(message) {
        this.message = message;
      }
      readBody() {
        return new Promise(async (resolve, reject) => {
          let output = Buffer.alloc(0);
          this.message.on("data", (chunk) => {
            output = Buffer.concat([output, chunk]);
          });
          this.message.on("end", () => {
            resolve(output.toString());
          });
        });
      }
    };
    exports2.HttpClientResponse = HttpClientResponse;
    function isHttps(requestUrl) {
      let parsedUrl = new URL(requestUrl);
      return parsedUrl.protocol === "https:";
    }
    exports2.isHttps = isHttps;
    var HttpClient = class {
      constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
          if (requestOptions.ignoreSslError != null) {
            this._ignoreSslError = requestOptions.ignoreSslError;
          }
          this._socketTimeout = requestOptions.socketTimeout;
          if (requestOptions.allowRedirects != null) {
            this._allowRedirects = requestOptions.allowRedirects;
          }
          if (requestOptions.allowRedirectDowngrade != null) {
            this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
          }
          if (requestOptions.maxRedirects != null) {
            this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
          }
          if (requestOptions.keepAlive != null) {
            this._keepAlive = requestOptions.keepAlive;
          }
          if (requestOptions.allowRetries != null) {
            this._allowRetries = requestOptions.allowRetries;
          }
          if (requestOptions.maxRetries != null) {
            this._maxRetries = requestOptions.maxRetries;
          }
        }
      }
      options(requestUrl, additionalHeaders) {
        return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
      }
      get(requestUrl, additionalHeaders) {
        return this.request("GET", requestUrl, null, additionalHeaders || {});
      }
      del(requestUrl, additionalHeaders) {
        return this.request("DELETE", requestUrl, null, additionalHeaders || {});
      }
      post(requestUrl, data, additionalHeaders) {
        return this.request("POST", requestUrl, data, additionalHeaders || {});
      }
      patch(requestUrl, data, additionalHeaders) {
        return this.request("PATCH", requestUrl, data, additionalHeaders || {});
      }
      put(requestUrl, data, additionalHeaders) {
        return this.request("PUT", requestUrl, data, additionalHeaders || {});
      }
      head(requestUrl, additionalHeaders) {
        return this.request("HEAD", requestUrl, null, additionalHeaders || {});
      }
      sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
      }
      async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
          throw new Error("Client has already been disposed.");
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
          response = await this.requestRaw(info, data);
          if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
            let authenticationHandler;
            for (let i = 0; i < this.handlers.length; i++) {
              if (this.handlers[i].canHandleAuthentication(response)) {
                authenticationHandler = this.handlers[i];
                break;
              }
            }
            if (authenticationHandler) {
              return authenticationHandler.handleAuthentication(this, info, data);
            } else {
              return response;
            }
          }
          let redirectsRemaining = this._maxRedirects;
          while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0) {
            const redirectUrl = response.message.headers["location"];
            if (!redirectUrl) {
              break;
            }
            let parsedRedirectUrl = new URL(redirectUrl);
            if (parsedUrl.protocol == "https:" && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
              throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
            }
            await response.readBody();
            if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
              for (let header in headers) {
                if (header.toLowerCase() === "authorization") {
                  delete headers[header];
                }
              }
            }
            info = this._prepareRequest(verb, parsedRedirectUrl, headers);
            response = await this.requestRaw(info, data);
            redirectsRemaining--;
          }
          if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
            return response;
          }
          numTries += 1;
          if (numTries < maxTries) {
            await response.readBody();
            await this._performExponentialBackoff(numTries);
          }
        }
        return response;
      }
      dispose() {
        if (this._agent) {
          this._agent.destroy();
        }
        this._disposed = true;
      }
      requestRaw(info, data) {
        return new Promise((resolve, reject) => {
          let callbackForResult = function(err, res) {
            if (err) {
              reject(err);
            }
            resolve(res);
          };
          this.requestRawWithCallback(info, data, callbackForResult);
        });
      }
      requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === "string") {
          info.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8");
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
          if (!callbackCalled) {
            callbackCalled = true;
            onResult(err, res);
          }
        };
        let req = info.httpModule.request(info.options, (msg) => {
          let res = new HttpClientResponse(msg);
          handleResult(null, res);
        });
        req.on("socket", (sock) => {
          socket = sock;
        });
        req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
          if (socket) {
            socket.end();
          }
          handleResult(new Error("Request timeout: " + info.options.path), null);
        });
        req.on("error", function(err) {
          handleResult(err, null);
        });
        if (data && typeof data === "string") {
          req.write(data, "utf8");
        }
        if (data && typeof data !== "string") {
          data.on("close", function() {
            req.end();
          });
          data.pipe(req);
        } else {
          req.end();
        }
      }
      getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
      }
      _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === "https:";
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || "") + (info.parsedUrl.search || "");
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
          info.options.headers["user-agent"] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        if (this.handlers) {
          this.handlers.forEach((handler) => {
            handler.prepareRequest(info.options);
          });
        }
        return info;
      }
      _mergeHeaders(headers) {
        const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        if (this.requestOptions && this.requestOptions.headers) {
          return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
      }
      _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
          clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
      }
      _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
          agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
          agent = this._agent;
        }
        if (!!agent) {
          return agent;
        }
        const usingSsl = parsedUrl.protocol === "https:";
        let maxSockets = 100;
        if (!!this.requestOptions) {
          maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
          if (!tunnel) {
            tunnel = require_tunnel2();
          }
          const agentOptions = {
            maxSockets,
            keepAlive: this._keepAlive,
            proxy: {
              ...(proxyUrl.username || proxyUrl.password) && {
                proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
              },
              host: proxyUrl.hostname,
              port: proxyUrl.port
            }
          };
          let tunnelAgent;
          const overHttps = proxyUrl.protocol === "https:";
          if (usingSsl) {
            tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
          } else {
            tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
          }
          agent = tunnelAgent(agentOptions);
          this._proxyAgent = agent;
        }
        if (this._keepAlive && !agent) {
          const options = { keepAlive: this._keepAlive, maxSockets };
          agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
          this._agent = agent;
        }
        if (!agent) {
          agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
          agent.options = Object.assign(agent.options || {}, {
            rejectUnauthorized: false
          });
        }
        return agent;
      }
      _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise((resolve) => setTimeout(() => resolve(), ms));
      }
      static dateTimeDeserializer(key, value) {
        if (typeof value === "string") {
          let a = new Date(value);
          if (!isNaN(a.valueOf())) {
            return a;
          }
        }
        return value;
      }
      async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
          const statusCode = res.message.statusCode;
          const response = {
            statusCode,
            result: null,
            headers: {}
          };
          if (statusCode == HttpCodes.NotFound) {
            resolve(response);
          }
          let obj;
          let contents;
          try {
            contents = await res.readBody();
            if (contents && contents.length > 0) {
              if (options && options.deserializeDates) {
                obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
              } else {
                obj = JSON.parse(contents);
              }
              response.result = obj;
            }
            response.headers = res.message.headers;
          } catch (err) {
          }
          if (statusCode > 299) {
            let msg;
            if (obj && obj.message) {
              msg = obj.message;
            } else if (contents && contents.length > 0) {
              msg = contents;
            } else {
              msg = "Failed request: (" + statusCode + ")";
            }
            let err = new HttpClientError(msg, statusCode);
            err.result = response.result;
            reject(err);
          } else {
            resolve(response);
          }
        });
      }
    };
    exports2.HttpClient = HttpClient;
  }
});

// node_modules/@actions/http-client/auth.js
var require_auth = __commonJS({
  "node_modules/@actions/http-client/auth.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var BasicCredentialHandler = class {
      constructor(username, password) {
        this.username = username;
        this.password = password;
      }
      prepareRequest(options) {
        options.headers["Authorization"] = "Basic " + Buffer.from(this.username + ":" + this.password).toString("base64");
      }
      canHandleAuthentication(response) {
        return false;
      }
      handleAuthentication(httpClient, requestInfo, objs) {
        return null;
      }
    };
    exports2.BasicCredentialHandler = BasicCredentialHandler;
    var BearerCredentialHandler = class {
      constructor(token) {
        this.token = token;
      }
      prepareRequest(options) {
        options.headers["Authorization"] = "Bearer " + this.token;
      }
      canHandleAuthentication(response) {
        return false;
      }
      handleAuthentication(httpClient, requestInfo, objs) {
        return null;
      }
    };
    exports2.BearerCredentialHandler = BearerCredentialHandler;
    var PersonalAccessTokenCredentialHandler = class {
      constructor(token) {
        this.token = token;
      }
      prepareRequest(options) {
        options.headers["Authorization"] = "Basic " + Buffer.from("PAT:" + this.token).toString("base64");
      }
      canHandleAuthentication(response) {
        return false;
      }
      handleAuthentication(httpClient, requestInfo, objs) {
        return null;
      }
    };
    exports2.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
  }
});

// node_modules/@actions/core/lib/oidc-utils.js
var require_oidc_utils = __commonJS({
  "node_modules/@actions/core/lib/oidc-utils.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OidcClient = void 0;
    var http_client_1 = require_http_client();
    var auth_1 = require_auth();
    var core_1 = require_core();
    var OidcClient = class {
      static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
          allowRetries: allowRetry,
          maxRetries: maxRetry
        };
        return new http_client_1.HttpClient("actions/oidc-client", [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
      }
      static getRequestToken() {
        const token = process.env["ACTIONS_ID_TOKEN_REQUEST_TOKEN"];
        if (!token) {
          throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable");
        }
        return token;
      }
      static getIDTokenUrl() {
        const runtimeUrl = process.env["ACTIONS_ID_TOKEN_REQUEST_URL"];
        if (!runtimeUrl) {
          throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable");
        }
        return runtimeUrl;
      }
      static getCall(id_token_url) {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          const httpclient = OidcClient.createHttpClient();
          const res = yield httpclient.getJson(id_token_url).catch((error) => {
            throw new Error(`Failed to get ID Token. 
 
        Error Code : ${error.statusCode}
 
        Error Message: ${error.result.message}`);
          });
          const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
          if (!id_token) {
            throw new Error("Response json body do not have ID Token field");
          }
          return id_token;
        });
      }
      static getIDToken(audience) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let id_token_url = OidcClient.getIDTokenUrl();
            if (audience) {
              const encodedAudience = encodeURIComponent(audience);
              id_token_url = `${id_token_url}&audience=${encodedAudience}`;
            }
            core_1.debug(`ID token url is ${id_token_url}`);
            const id_token = yield OidcClient.getCall(id_token_url);
            core_1.setSecret(id_token);
            return id_token;
          } catch (error) {
            throw new Error(`Error message: ${error.message}`);
          }
        });
      }
    };
    exports2.OidcClient = OidcClient;
  }
});

// node_modules/@actions/core/lib/markdown-summary.js
var require_markdown_summary = __commonJS({
  "node_modules/@actions/core/lib/markdown-summary.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.markdownSummary = exports2.SUMMARY_DOCS_URL = exports2.SUMMARY_ENV_VAR = void 0;
    var os_1 = require("os");
    var fs_1 = require("fs");
    var { access, appendFile, writeFile } = fs_1.promises;
    exports2.SUMMARY_ENV_VAR = "GITHUB_STEP_SUMMARY";
    exports2.SUMMARY_DOCS_URL = "https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-markdown-summary";
    var MarkdownSummary = class {
      constructor() {
        this._buffer = "";
      }
      filePath() {
        return __awaiter2(this, void 0, void 0, function* () {
          if (this._filePath) {
            return this._filePath;
          }
          const pathFromEnv = process.env[exports2.SUMMARY_ENV_VAR];
          if (!pathFromEnv) {
            throw new Error(`Unable to find environment variable for $${exports2.SUMMARY_ENV_VAR}. Check if your runtime environment supports markdown summaries.`);
          }
          try {
            yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
          } catch (_a) {
            throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
          }
          this._filePath = pathFromEnv;
          return this._filePath;
        });
      }
      wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs).map(([key, value]) => ` ${key}="${value}"`).join("");
        if (!content) {
          return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
      }
      write(options) {
        return __awaiter2(this, void 0, void 0, function* () {
          const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
          const filePath = yield this.filePath();
          const writeFunc = overwrite ? writeFile : appendFile;
          yield writeFunc(filePath, this._buffer, { encoding: "utf8" });
          return this.emptyBuffer();
        });
      }
      clear() {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.emptyBuffer().write({ overwrite: true });
        });
      }
      stringify() {
        return this._buffer;
      }
      isEmptyBuffer() {
        return this._buffer.length === 0;
      }
      emptyBuffer() {
        this._buffer = "";
        return this;
      }
      addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
      }
      addEOL() {
        return this.addRaw(os_1.EOL);
      }
      addCodeBlock(code, lang) {
        const attrs = Object.assign({}, lang && { lang });
        const element = this.wrap("pre", this.wrap("code", code), attrs);
        return this.addRaw(element).addEOL();
      }
      addList(items, ordered = false) {
        const tag = ordered ? "ol" : "ul";
        const listItems = items.map((item) => this.wrap("li", item)).join("");
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
      }
      addTable(rows) {
        const tableBody = rows.map((row) => {
          const cells = row.map((cell) => {
            if (typeof cell === "string") {
              return this.wrap("td", cell);
            }
            const { header, data, colspan, rowspan } = cell;
            const tag = header ? "th" : "td";
            const attrs = Object.assign(Object.assign({}, colspan && { colspan }), rowspan && { rowspan });
            return this.wrap(tag, data, attrs);
          }).join("");
          return this.wrap("tr", cells);
        }).join("");
        const element = this.wrap("table", tableBody);
        return this.addRaw(element).addEOL();
      }
      addDetails(label, content) {
        const element = this.wrap("details", this.wrap("summary", label) + content);
        return this.addRaw(element).addEOL();
      }
      addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, width && { width }), height && { height });
        const element = this.wrap("img", null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
      }
      addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag) ? tag : "h1";
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
      }
      addSeparator() {
        const element = this.wrap("hr", null);
        return this.addRaw(element).addEOL();
      }
      addBreak() {
        const element = this.wrap("br", null);
        return this.addRaw(element).addEOL();
      }
      addQuote(text, cite) {
        const attrs = Object.assign({}, cite && { cite });
        const element = this.wrap("blockquote", text, attrs);
        return this.addRaw(element).addEOL();
      }
      addLink(text, href) {
        const element = this.wrap("a", text, { href });
        return this.addRaw(element).addEOL();
      }
    };
    exports2.markdownSummary = new MarkdownSummary();
  }
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS({
  "node_modules/@actions/core/lib/core.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getIDToken = exports2.getState = exports2.saveState = exports2.group = exports2.endGroup = exports2.startGroup = exports2.info = exports2.notice = exports2.warning = exports2.error = exports2.debug = exports2.isDebug = exports2.setFailed = exports2.setCommandEcho = exports2.setOutput = exports2.getBooleanInput = exports2.getMultilineInput = exports2.getInput = exports2.addPath = exports2.setSecret = exports2.exportVariable = exports2.ExitCode = void 0;
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils();
    var os = __importStar(require("os"));
    var path = __importStar(require("path"));
    var oidc_utils_1 = require_oidc_utils();
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports2.exportVariable = exportVariable;
    function setSecret(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports2.setSecret = setSecret;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path.delimiter}${process.env["PATH"]}`;
    }
    exports2.addPath = addPath;
    function getInput(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports2.getInput = getInput;
    function getMultilineInput(name, options) {
      const inputs = getInput(name, options).split("\n").filter((x) => x !== "");
      return inputs;
    }
    exports2.getMultilineInput = getMultilineInput;
    function getBooleanInput(name, options) {
      const trueValue = ["true", "True", "TRUE"];
      const falseValue = ["false", "False", "FALSE"];
      const val = getInput(name, options);
      if (trueValue.includes(val))
        return true;
      if (falseValue.includes(val))
        return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports2.getBooleanInput = getBooleanInput;
    function setOutput(name, value) {
      process.stdout.write(os.EOL);
      command_1.issueCommand("set-output", { name }, value);
    }
    exports2.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports2.setCommandEcho = setCommandEcho;
    function setFailed(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports2.setFailed = setFailed;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports2.isDebug = isDebug;
    function debug(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports2.debug = debug;
    function error(message, properties = {}) {
      command_1.issueCommand("error", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.error = error;
    function warning(message, properties = {}) {
      command_1.issueCommand("warning", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.warning = warning;
    function notice(message, properties = {}) {
      command_1.issueCommand("notice", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.notice = notice;
    function info(message) {
      process.stdout.write(message + os.EOL);
    }
    exports2.info = info;
    function startGroup(name) {
      command_1.issue("group", name);
    }
    exports2.startGroup = startGroup;
    function endGroup() {
      command_1.issue("endgroup");
    }
    exports2.endGroup = endGroup;
    function group(name, fn) {
      return __awaiter2(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup();
        }
        return result;
      });
    }
    exports2.group = group;
    function saveState(name, value) {
      command_1.issueCommand("save-state", { name }, value);
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports2.getState = getState;
    function getIDToken(aud) {
      return __awaiter2(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
      });
    }
    exports2.getIDToken = getIDToken;
    var markdown_summary_1 = require_markdown_summary();
    Object.defineProperty(exports2, "markdownSummary", { enumerable: true, get: function() {
      return markdown_summary_1.markdownSummary;
    } });
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/host/InputValidator.js
var require_InputValidator = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/host/InputValidator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InputValidator = void 0;
    var InputValidator = class {
      constructor(host) {
        this._host = host;
      }
      getInput(params) {
        const val = this._host.getInput(params);
        if (val === void 0 && params.defaultValue !== void 0) {
          return params.defaultValue.toString();
        }
        return val;
      }
      pushInput(pacArgs, property, paramEntry, callback) {
        if (!paramEntry) {
          return;
        }
        let val = this.getInput(paramEntry);
        if (!val && paramEntry.required) {
          throw new Error(`Required ${paramEntry.name} not set`);
        } else if (val) {
          if (callback) {
            val = callback(val);
          }
          pacArgs.push(property, val);
        }
      }
    };
    exports2.InputValidator = InputValidator;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/auth/authenticate.js
var require_authenticate = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/auth/authenticate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.clearAuthentication = exports2.authenticateEnvironment = exports2.authenticateAdmin = void 0;
    function authenticateAdmin(pac, credentials) {
      return pac("auth", "create", "--kind", "ADMIN", ...addCredentials(credentials), ...addCloudInstance(credentials));
    }
    exports2.authenticateAdmin = authenticateAdmin;
    function authenticateEnvironment(pac, credentials, environmentUrl) {
      return pac("auth", "create", ...addUrl(environmentUrl), ...addCredentials(credentials), ...addCloudInstance(credentials));
    }
    exports2.authenticateEnvironment = authenticateEnvironment;
    function clearAuthentication(pac) {
      return pac("auth", "clear");
    }
    exports2.clearAuthentication = clearAuthentication;
    function addUrl(url) {
      return ["--url", url];
    }
    function addCredentials(credentials) {
      return isUsernamePassword(credentials) ? addUsernamePassword(credentials) : addClientCredentials(credentials);
    }
    function isUsernamePassword(credentials) {
      return "username" in credentials;
    }
    function addClientCredentials(parameters) {
      return ["--tenant", parameters.tenantId, "--applicationId", parameters.appId, "--clientSecret", parameters.clientSecret];
    }
    function addUsernamePassword(parameters) {
      return ["--username", parameters.username, "--password", parameters.password];
    }
    function addCloudInstance(parameters) {
      const cloudInstance = parameters.cloudInstance || "Public";
      return ["--cloud", cloudInstance];
    }
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/CommandRunner.js
var require_CommandRunner = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/CommandRunner.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RunnerError = exports2.createCommandRunner = void 0;
    var child_process_1 = require("child_process");
    var process_1 = require("process");
    var readline = require("readline");
    var os_1 = require("os");
    var process2 = require("process");
    function createCommandRunner(workingDir, commandPath, logger, options, agent) {
      return function run(...args) {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            logInitialization(...args);
            const allOutput = [];
            const cp = (0, child_process_1.spawn)(commandPath, args, Object.assign({ cwd: workingDir, env: Object.assign({
              PATH: process_1.env.PATH,
              "PP_TOOLS_AUTOMATION_AGENT": agent
            }, process2.env) }, options));
            const outputLineReader = readline.createInterface({ input: cp.stdout });
            outputLineReader.on("line", logOutputFactory(logger.log));
            const errorLineReader = readline.createInterface({ input: cp.stderr });
            errorLineReader.on("line", logOutputFactory(logger.error));
            function logOutputFactory(logFunction) {
              return (line) => {
                allOutput.push(line);
                logFunction(line);
              };
            }
            cp.on("exit", (code) => {
              if (code === 0) {
                resolve(allOutput);
              } else {
                logger.error(`error: ${code}`);
                reject(new RunnerError(code, allOutput.join(os_1.EOL)));
              }
              outputLineReader.close();
              errorLineReader.close();
              cp.stdout.destroy();
              cp.stderr.destroy();
            });
          });
        });
      };
      function logInitialization(...args) {
        logger.debug(`command: ${commandPath}, first arg of ${args.length}: ${args.length ? args[0] : "<none>"}`);
      }
    }
    exports2.createCommandRunner = createCommandRunner;
    var RunnerError = class extends Error {
      constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
      }
    };
    exports2.RunnerError = RunnerError;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/createPacRunner.js
var require_createPacRunner = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/createPacRunner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var os_1 = require("os");
    var path_1 = require("path");
    var CommandRunner_1 = require_CommandRunner();
    function createPacRunner({ workingDir, runnersDir, logger, agent }) {
      return (0, CommandRunner_1.createCommandRunner)(workingDir, (0, os_1.platform)() === "win32" ? (0, path_1.resolve)(runnersDir, "pac", "tools", "pac.exe") : (0, path_1.resolve)(runnersDir, "pac_linux", "tools", "pac"), logger, void 0, agent);
    }
    exports2.default = createPacRunner;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/exportSolution.js
var require_exportSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/exportSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.exportSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function exportSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "export"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--name", parameters.name);
          validator.pushInput(pacArgs, "--path", parameters.path, (value) => path.resolve(runnerParameters.workingDir, value));
          validator.pushInput(pacArgs, "--managed", parameters.managed);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          validator.pushInput(pacArgs, "--targetversion", parameters.targetVersion);
          const includeArgs = [];
          if (validator.getInput(parameters.autoNumberSettings) === "true") {
            includeArgs.push("autonumbering");
          }
          if (validator.getInput(parameters.calenderSettings) === "true") {
            includeArgs.push("calendar");
          }
          if (validator.getInput(parameters.customizationSettings) === "true") {
            includeArgs.push("customization");
          }
          if (validator.getInput(parameters.emailTrackingSettings) === "true") {
            includeArgs.push("emailtracking");
          }
          if (validator.getInput(parameters.externalApplicationSettings) === "true") {
            includeArgs.push("externalapplications");
          }
          if (validator.getInput(parameters.generalSettings) === "true") {
            includeArgs.push("general");
          }
          if (validator.getInput(parameters.isvConfig) === "true") {
            includeArgs.push("isvconfig");
          }
          if (validator.getInput(parameters.marketingSettings) === "true") {
            includeArgs.push("marketing");
          }
          if (validator.getInput(parameters.outlookSynchronizationSettings) === "true") {
            includeArgs.push("outlooksynchronization");
          }
          if (validator.getInput(parameters.relationshipRoles) === "true") {
            includeArgs.push("relationshiproles");
          }
          if (validator.getInput(parameters.sales) === "true") {
            includeArgs.push("sales");
          }
          if (includeArgs.length > 0) {
            pacArgs.push("--include", includeArgs.join(","));
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("ExportSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.exportSolution = exportSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/whoAmI.js
var require_whoAmI = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/whoAmI.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.whoAmI = void 0;
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function whoAmI(parameters, runnerParameters) {
      var _a;
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacResult = yield pac("org", "who");
          logger.log("WhoAmI Action Result: " + pacResult);
          const envIdLabel = "Environment ID:";
          const envId = (_a = pacResult.filter((l) => l.length > 0).filter((l) => l.includes(envIdLabel))) === null || _a === void 0 ? void 0 : _a[0].split(envIdLabel)[1].trim();
          return {
            environmentId: envId
          };
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.whoAmI = whoAmI;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/importSolution.js
var require_importSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/importSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.importSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function importSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "import"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path, (value) => path.resolve(runnerParameters.workingDir, value));
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--import-as-holding", parameters.importAsHolding);
          validator.pushInput(pacArgs, "--force-overwrite", parameters.forceOverwrite);
          validator.pushInput(pacArgs, "--publish-changes", parameters.publishChanges);
          validator.pushInput(pacArgs, "--skip-dependency-check", parameters.skipDependencyCheck);
          validator.pushInput(pacArgs, "--convert-to-managed", parameters.convertToManaged);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          validator.pushInput(pacArgs, "--activate-plugins", parameters.activatePlugins);
          if (validator.getInput(parameters.useDeploymentSettingsFile) === "true") {
            validator.pushInput(pacArgs, "--settings-file", parameters.deploymentSettingsFile);
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("ImportSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.importSolution = importSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/upgradeSolution.js
var require_upgradeSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/upgradeSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.upgradeSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function upgradeSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "upgrade"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--solution-name", parameters.name);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UpgradeSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.upgradeSolution = upgradeSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteEnvironment.js
var require_deleteEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function deleteEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "delete"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DeleteEnvironment Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.deleteEnvironment = deleteEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/backupEnvironment.js
var require_backupEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/backupEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.backupEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function backupEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "backup"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          validator.pushInput(pacArgs, "--label", parameters.backupLabel);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("BackupEnvironment Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.backupEnvironment = backupEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/checkSolution.js
var require_checkSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/checkSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.checkSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function checkSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const validator = new InputValidator_1.InputValidator(host);
        let level;
        let threshold;
        if (parameters.errorLevel != void 0 && parameters.errorThreshold != void 0) {
          level = validator.getInput(parameters.errorLevel);
          threshold = validator.getInput(parameters.errorThreshold);
        }
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "check"];
          if (parameters.fileLocation != void 0 && validator.getInput(parameters.fileLocation) === "sasUriFile") {
            validator.pushInput(pacArgs, "--solutionUrl", parameters.solutionUrl);
          } else {
            validator.pushInput(pacArgs, "--path", parameters.solutionPath, (value) => path.resolve(runnerParameters.workingDir, value));
          }
          validator.pushInput(pacArgs, "--geo", parameters.geoInstance);
          validator.pushInput(pacArgs, "--ruleSet", parameters.ruleSet);
          validator.pushInput(pacArgs, "--ruleLevelOverride", parameters.ruleLevelOverride);
          validator.pushInput(pacArgs, "--outputDirectory", parameters.outputDirectory);
          validator.pushInput(pacArgs, "--excludedFiles", parameters.filesExcluded);
          if (parameters.useDefaultPAEndpoint != void 0 && validator.getInput(parameters.useDefaultPAEndpoint) === "true") {
            pacArgs.push("--customEndpoint", parameters.environmentUrl);
          } else {
            validator.pushInput(pacArgs, "--customEndpoint", parameters.customPAEndpoint);
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CheckSolution Action Result: " + pacResult);
          const status = pacResult[pacResult.length - 7].split(" ")[2];
          if (status === "Failed" || status === "FinishedWithErrors") {
            throw new Error("PowerApps Checker analysis results indicate a failure or error during the analysis process.");
          }
          if (level != void 0 && threshold != void 0) {
            errorCheck(pacResult, level, parseInt(threshold));
          }
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.checkSolution = checkSolution;
    function errorCheck(pacResults, errorLevel, errorThreshold) {
      const errors = {};
      const PAErrorLevels = pacResults[pacResults.length - 5].trim().split(/\s+/);
      const PAErrorValues = pacResults[pacResults.length - 3].trim().split(/\s+/);
      for (let i = 0; i < PAErrorLevels.length && i < PAErrorValues.length; i++) {
        errors[PAErrorLevels[i]] = parseInt(PAErrorValues[i]);
      }
      const issueCount = {
        "CriticalIssueCount": "Critical",
        "HighIssueCount": "High",
        "MediumIssueCount": "Medium",
        "LowIssueCount": "Low",
        "InformationalIssueCount": "Informational"
      };
      if (errors[issueCount[errorLevel]] > errorThreshold) {
        throw new Error("Analysis results do not pass with selected error level and threshold choices.  Please review detailed results in SARIF file for more information.");
      }
    }
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/publishSolution.js
var require_publishSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/publishSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.publishSolution = void 0;
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function publishSolution(parameters, runnerParameters) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacResult = yield pac("solution", "publish");
          logger.log("PublishSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.publishSolution = publishSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deployPackage.js
var require_deployPackage = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deployPackage.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deployPackage = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    var os = require("os");
    function deployPackage(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const platform = os.platform();
          if (platform !== "win32") {
            throw new Error(`deploy package is only supported on Windows agents/runners (attempted run on ${platform})`);
          }
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["package", "deploy"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--package", parameters.packagePath, (value) => path.resolve(runnerParameters.workingDir, value));
          validator.pushInput(pacArgs, "--logFile", parameters.logFile);
          validator.pushInput(pacArgs, "--logConsole", parameters.logConsole);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DeployPackage Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.deployPackage = deployPackage;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/createEnvironment.js
var require_createEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/createEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getEnvironmentDetails = exports2.createEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function createEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "create"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--name", parameters.environmentName);
          validator.pushInput(pacArgs, "--type", parameters.environmentType);
          validator.pushInput(pacArgs, "--templates", parameters.templates);
          validator.pushInput(pacArgs, "--region", parameters.region);
          validator.pushInput(pacArgs, "--currency", parameters.currency);
          validator.pushInput(pacArgs, "--language", parameters.language);
          validator.pushInput(pacArgs, "--domain", parameters.domainName);
          validator.pushInput(pacArgs, "--team-id", parameters.teamId);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CreateEnvironment Action Result: " + pacResult);
          const envResult = getEnvironmentDetails(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.createEnvironment = createEnvironment;
    function getEnvironmentDetails(pacResult) {
      var _a;
      const newEnvDetailColumns = (_a = pacResult.filter((l) => l.length > 0).pop()) === null || _a === void 0 ? void 0 : _a.trim().split(/\s+/);
      const envUrl = newEnvDetailColumns === null || newEnvDetailColumns === void 0 ? void 0 : newEnvDetailColumns.shift();
      const envId = newEnvDetailColumns === null || newEnvDetailColumns === void 0 ? void 0 : newEnvDetailColumns.shift();
      return {
        environmentId: envId,
        environmentUrl: envUrl
      };
    }
    exports2.getEnvironmentDetails = getEnvironmentDetails;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/restoreEnvironment.js
var require_restoreEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/restoreEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.restoreEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var createEnvironment_1 = require_createEnvironment();
    function restoreEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "restore"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--source-env", parameters.sourceEnvironment);
          validator.pushInput(pacArgs, "--target-env", parameters.targetEnvironment);
          validator.pushInput(pacArgs, "--source-url", parameters.sourceEnvironmentUrl);
          validator.pushInput(pacArgs, "--target-url", parameters.targetEnvironmentUrl);
          validator.pushInput(pacArgs, "--source-id", parameters.sourceEnvironmentId);
          validator.pushInput(pacArgs, "--target-id", parameters.targetEnvironmentId);
          validator.pushInput(pacArgs, "--name", parameters.targetEnvironmentName);
          if (validator.getInput(parameters.restoreLatestBackup) === "true") {
            pacArgs.push("--selected-backup", "latest");
          } else if (parameters.backupDateTime) {
            validator.pushInput(pacArgs, "--selected-backup", parameters.backupDateTime);
          } else {
            throw new Error("Either latest backup must be true or Valid date and time for backup must be provided.");
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("RestoreEnvironment Action Result: " + pacResult);
          const envResult = (0, createEnvironment_1.getEnvironmentDetails)(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.restoreEnvironment = restoreEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteSolution.js
var require_deleteSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function deleteSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "delete"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--solution-name", parameters.name);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DeleteSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.deleteSolution = deleteSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/solutionPackagingBase.js
var require_solutionPackagingBase = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/solutionPackagingBase.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.setSolutionPackagingCommonArgs = void 0;
    var path = require("path");
    function setSolutionPackagingCommonArgs(parameters, runnerParameters, validator, pacArgs) {
      validator.pushInput(pacArgs, "--zipFile", parameters.solutionZipFile, (value) => path.resolve(runnerParameters.workingDir, value));
      validator.pushInput(pacArgs, "--folder", parameters.sourceFolder, (value) => path.resolve(runnerParameters.workingDir, value));
      validator.pushInput(pacArgs, "--packageType", parameters.solutionType);
      validator.pushInput(pacArgs, "--localize", parameters.localize);
      validator.pushInput(pacArgs, "--log", parameters.logFile);
      validator.pushInput(pacArgs, "--errorlevel", parameters.errorLevel);
      validator.pushInput(pacArgs, "--singleComponent", parameters.singleComponent);
      validator.pushInput(pacArgs, "--map", parameters.mapFile);
      validator.pushInput(pacArgs, "--sourceLoc", parameters.localeTemplate);
      validator.pushInput(pacArgs, "--useLcid", parameters.useLcid);
      validator.pushInput(pacArgs, "--useUnmanagedFileForMissingManaged", parameters.useUnmanagedFileForManaged);
      validator.pushInput(pacArgs, "--disablePluginRemap", parameters.disablePluginRemap);
      validator.pushInput(pacArgs, "--processCanvasApps", parameters.processCanvasApps);
    }
    exports2.setSolutionPackagingCommonArgs = setSolutionPackagingCommonArgs;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/packSolution.js
var require_packSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/packSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.packSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var createPacRunner_1 = require_createPacRunner();
    var solutionPackagingBase_1 = require_solutionPackagingBase();
    function packSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const pacArgs = ["solution", "pack"];
          const validator = new InputValidator_1.InputValidator(host);
          (0, solutionPackagingBase_1.setSolutionPackagingCommonArgs)(parameters, runnerParameters, validator, pacArgs);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("PackSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        }
      });
    }
    exports2.packSolution = packSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/unpackSolution.js
var require_unpackSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/unpackSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.unpackSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var createPacRunner_1 = require_createPacRunner();
    var solutionPackagingBase_1 = require_solutionPackagingBase();
    function unpackSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const pacArgs = ["solution", "unpack"];
          const validator = new InputValidator_1.InputValidator(host);
          (0, solutionPackagingBase_1.setSolutionPackagingCommonArgs)(parameters, runnerParameters, validator, pacArgs);
          if (parameters.overwriteFiles && validator.getInput(parameters.overwriteFiles) === "true") {
            pacArgs.push("--allowDelete");
            pacArgs.push("true");
            pacArgs.push("--allowWrite");
            pacArgs.push("true");
            pacArgs.push("--clobber");
            pacArgs.push("true");
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UnpackSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        }
      });
    }
    exports2.unpackSolution = unpackSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/resetEnvironment.js
var require_resetEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/resetEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resetEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var createEnvironment_1 = require_createEnvironment();
    function resetEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "reset"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          validator.pushInput(pacArgs, "--language", parameters.language);
          validator.pushInput(pacArgs, "--currency", parameters.currency);
          validator.pushInput(pacArgs, "--purpose", parameters.purpose);
          validator.pushInput(pacArgs, "--templates", parameters.templates);
          if (validator.getInput(parameters.overrideDomainName) === "true") {
            validator.pushInput(pacArgs, "--domain", parameters.domainName);
          }
          if (validator.getInput(parameters.overrideFriendlyName) === "true") {
            validator.pushInput(pacArgs, "--name", parameters.friendlyEnvironmentName);
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("ResetEnvironment Action Result: " + pacResult);
          const envResult = (0, createEnvironment_1.getEnvironmentDetails)(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.resetEnvironment = resetEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/copyEnvironment.js
var require_copyEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/copyEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.copyEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var createEnvironment_1 = require_createEnvironment();
    function copyEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "copy"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--source-env", parameters.sourceEnvironment);
          validator.pushInput(pacArgs, "--target-env", parameters.targetEnvironment);
          validator.pushInput(pacArgs, "--source-url", parameters.sourceEnvironmentUrl);
          validator.pushInput(pacArgs, "--target-url", parameters.targetEnvironmentUrl);
          validator.pushInput(pacArgs, "--source-id", parameters.sourceEnvironmentId);
          validator.pushInput(pacArgs, "--target-id", parameters.targetEnvironmentId);
          if (validator.getInput(parameters.overrideFriendlyName) === "true") {
            validator.pushInput(pacArgs, "--name", parameters.friendlyTargetEnvironmentName);
          }
          validator.pushInput(pacArgs, "--type", parameters.copyType);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CopyEnvironment Action Result: " + pacResult);
          const envResult = (0, createEnvironment_1.getEnvironmentDetails)(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.copyEnvironment = copyEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/uploadPaportal.js
var require_uploadPaportal = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/uploadPaportal.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.uploadPaportal = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function uploadPaportal(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["paportal", "upload"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path);
          validator.pushInput(pacArgs, "--deploymentProfile", parameters.deploymentProfile);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UploadPaPortal Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.uploadPaportal = uploadPaportal;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/downloadPaportal.js
var require_downloadPaportal = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/downloadPaportal.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.downloadPaportal = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function downloadPaportal(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["paportal", "download"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path);
          validator.pushInput(pacArgs, "--websiteId", parameters.websiteId);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DownloadPaPortal Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.downloadPaportal = downloadPaportal;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/cloneSolution.js
var require_cloneSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/cloneSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cloneSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function cloneSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "clone"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--name", parameters.name);
          validator.pushInput(pacArgs, "--targetversion", parameters.targetVersion);
          validator.pushInput(pacArgs, "--outputDirectory", parameters.outputDirectory);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CloneSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.cloneSolution = cloneSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/updateVersionSolution.js
var require_updateVersionSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/updateVersionSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.updateVersionSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function updateVersionSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "version"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--buildversion", parameters.buildVersion);
          validator.pushInput(pacArgs, "--revisionversion", parameters.revisionVersion);
          validator.pushInput(pacArgs, "--patchversion", parameters.patchVersion);
          validator.pushInput(pacArgs, "--strategy", parameters.strategy);
          validator.pushInput(pacArgs, "--filename", parameters.fileName);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UpdateVersionSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.updateVersionSolution = updateVersionSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/onlineVersionSolution.js
var require_onlineVersionSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/onlineVersionSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.onlineVersionSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function onlineVersionSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "online-version"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--solution-name", parameters.name);
          validator.pushInput(pacArgs, "--solution-version", parameters.version);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("OnlineVersionSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.onlineVersionSolution = onlineVersionSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/installApplication.js
var require_installApplication = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/installApplication.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.installApplication = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function installApplication(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["application", "install"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          validator.pushInput(pacArgs, "--application-name", parameters.applicationName);
          validator.pushInput(pacArgs, "--application-list", parameters.applicationList, (value) => path.resolve(runnerParameters.workingDir, value));
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("Application Install Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.installApplication = installApplication;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/listApplication.js
var require_listApplication = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/listApplication.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.listApplication = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function listApplication(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["application", "list"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          validator.pushInput(pacArgs, "--output", parameters.output, (value) => path.resolve(runnerParameters.workingDir, value));
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("Application List Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.listApplication = listApplication;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/assignUser.js
var require_assignUser = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/assignUser.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assignUser = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function assignUser(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["admin", "assign-user"];
        const validator = new InputValidator_1.InputValidator(host);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials);
          logger.log("The Authentication Result: " + authenticateResult);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--object-id", parameters.objectId);
          validator.pushInput(pacArgs, "--role", parameters.role);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("AssignUser Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.assignUser = assignUser;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/index.js
var require_actions = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_exportSolution(), exports2);
    __exportStar(require_whoAmI(), exports2);
    __exportStar(require_importSolution(), exports2);
    __exportStar(require_upgradeSolution(), exports2);
    __exportStar(require_deleteEnvironment(), exports2);
    __exportStar(require_backupEnvironment(), exports2);
    __exportStar(require_checkSolution(), exports2);
    __exportStar(require_publishSolution(), exports2);
    __exportStar(require_deployPackage(), exports2);
    __exportStar(require_createEnvironment(), exports2);
    __exportStar(require_restoreEnvironment(), exports2);
    __exportStar(require_deleteSolution(), exports2);
    __exportStar(require_packSolution(), exports2);
    __exportStar(require_unpackSolution(), exports2);
    __exportStar(require_resetEnvironment(), exports2);
    __exportStar(require_copyEnvironment(), exports2);
    __exportStar(require_uploadPaportal(), exports2);
    __exportStar(require_downloadPaportal(), exports2);
    __exportStar(require_cloneSolution(), exports2);
    __exportStar(require_updateVersionSolution(), exports2);
    __exportStar(require_onlineVersionSolution(), exports2);
    __exportStar(require_installApplication(), exports2);
    __exportStar(require_listApplication(), exports2);
    __exportStar(require_assignUser(), exports2);
  }
});

// out/lib/auth/getCredentials.js
var require_getCredentials = __commonJS({
  "out/lib/auth/getCredentials.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core();
    function getCredentials() {
      const usernamePassword = {
        username: getInput("user-name"),
        password: getInput("password-secret"),
        cloudInstance: getInput("cloud")
      };
      const isUpValid = isUsernamePasswordValid(usernamePassword);
      const clientCredentials = {
        appId: getInput("app-id"),
        clientSecret: getInput("client-secret"),
        tenantId: getInput("tenant-id"),
        cloudInstance: getInput("cloud")
      };
      const isCcValid = isClientCredentialsValid(clientCredentials);
      if (isUpValid && isCcValid) {
        throw new Error("Too many authentication parameters specified. Must pick either username/password or app-id/client-secret/tenant-id for the authentication flow.");
      }
      if (isUpValid) {
        return usernamePassword;
      }
      if (isCcValid) {
        return clientCredentials;
      }
      throw new Error("Must provide either username/password or app-id/client-secret/tenant-id for authentication!");
    }
    exports2.default = getCredentials;
    function getInput(name) {
      return (0, core_1.getInput)(name, { required: false });
    }
    function isUsernamePasswordValid(usernamePassword) {
      return !!usernamePassword.username && !!usernamePassword.password;
    }
    function isClientCredentialsValid(clientCredentials) {
      return !!clientCredentials.appId && !!clientCredentials.clientSecret && !!clientCredentials.tenantId;
    }
  }
});

// out/lib/auth/getEnvironmentUrl.js
var require_getEnvironmentUrl = __commonJS({
  "out/lib/auth/getEnvironmentUrl.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core();
    function getEnvironmentUrl() {
      return (0, core_1.getInput)("environment-url", { required: false });
    }
    exports2.default = getEnvironmentUrl;
  }
});

// out/lib/actionLogger.js
var require_actionLogger = __commonJS({
  "out/lib/actionLogger.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ActionLogger = void 0;
    var core2 = require_core();
    var ActionLogger = class {
      info(...args) {
        core2.info(args.join());
      }
      warn(...args) {
        core2.warning(args.join());
      }
      error(...args) {
        const errorMessage = args.join();
        core2.setFailed(errorMessage);
        core2.error(errorMessage);
      }
      debug(...args) {
        core2.debug(args.join());
      }
      log(...args) {
        console.log(args.join());
      }
    };
    exports2.ActionLogger = ActionLogger;
  }
});

// out/lib/getExePath.js
var require_getExePath = __commonJS({
  "out/lib/getExePath.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path_1 = require("path");
    function getExePath(...relativePath) {
      const currentDirectory = (0, path_1.resolve)(__dirname);
      const parentDir = (0, path_1.dirname)(currentDirectory);
      let outDirRoot;
      switch ((0, path_1.basename)(parentDir)) {
        case "actions":
          outDirRoot = (0, path_1.resolve)((0, path_1.dirname)(parentDir));
          break;
        case "src":
        case "out":
          outDirRoot = (0, path_1.resolve)(parentDir, "..", "out");
          break;
        default:
          throw Error(`ExeRunner: cannot resolve outDirRoot running from this location: ${path_1.dirname}`);
      }
      return (0, path_1.resolve)(outDirRoot, ...relativePath);
    }
    exports2.default = getExePath;
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "@microsoft/powerplatform-actions",
      version: "0.1.0",
      description: "Github Action for Power Platform",
      main: "index.js",
      scripts: {
        clean: "scorch",
        build: "node node_modules/gulp/bin/gulp.js",
        test: "node node_modules/gulp/bin/gulp.js test",
        ci: "node node_modules/gulp/bin/gulp.js ci",
        "update-dist": "node node_modules/gulp/bin/gulp.js updateDist"
      },
      author: "PowerApps-ISV-Tools",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/microsoft/powerplatform-actions.git"
      },
      devDependencies: {
        "@types/async": "^3.2.7",
        "@types/chai": "^4.2.20",
        "@types/fancy-log": "^1.3.1",
        "@types/fs-extra": "^9.0.12",
        "@types/glob": "^7.1.4",
        "@types/js-yaml": "^4.0.3",
        "@types/mocha": "^9.1.0",
        "@types/node": "^14.14.35",
        "@types/sinon": "^9.0.11",
        "@types/sinon-chai": "^3.2.5",
        "@types/uuid": "^8.3.0",
        "@types/yargs": "^17.0.2",
        "@typescript-eslint/eslint-plugin": "^5.15.0",
        "@typescript-eslint/parser": "^5.15.0",
        async: "^3.2.0",
        chai: "^4.3.4",
        dotenv: "^8.2.0",
        esbuild: "^0.14.10",
        eslint: "^8.11.0",
        "fancy-log": "^1.3.3",
        glob: "^7.2.0",
        "glob-parent": "^6.0.2",
        gulp: "^4.0.2",
        "gulp-eslint": "^6.0.0",
        "gulp-mocha": "^8.0.0",
        "gulp-sourcemaps": "^3.0.0",
        "gulp-typescript": "^6.0.0-alpha.1",
        mocha: "^9.2.0",
        nanoid: "^3.2.0",
        "node-fetch": "^2.6.7",
        postcss: "^8.4.6",
        "ps-list": "^7.2.0",
        rewiremock: "^3.14.3",
        sinon: "^9.2.4",
        "sinon-chai": "^3.5.0",
        "ts-node": "^10.0.0",
        "ts-sinon": "^2.0.1",
        typescript: "^4.3.5",
        "unzip-stream": "^0.3.0",
        winston: "^3.3.3",
        yargs: "^17.0.1"
      },
      dependencies: {
        "@actions/artifact": "^0.5.2",
        "@actions/core": "^1.4.0",
        "@microsoft/powerplatform-cli-wrapper": "0.1.50",
        "date-fns": "^2.22.1",
        "fs-extra": "^10.0.0",
        "js-yaml": "^4.1",
        uuid: "^8.3.2"
      }
    };
  }
});

// out/lib/runnerParameters.js
var require_runnerParameters = __commonJS({
  "out/lib/runnerParameters.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getAutomationAgent = exports2.runnerParameters = void 0;
    var process_1 = require("process");
    var actionLogger_1 = require_actionLogger();
    var getExePath_1 = require_getExePath();
    function getAutomationAgent() {
      const jsonPackage = require_package();
      const productName = jsonPackage.name.split("/")[1];
      return productName + "/" + jsonPackage.version;
    }
    exports2.getAutomationAgent = getAutomationAgent;
    var runnerParameters = {
      runnersDir: (0, getExePath_1.default)(),
      workingDir: (0, process_1.cwd)(),
      logger: new actionLogger_1.ActionLogger(),
      agent: getAutomationAgent()
    };
    exports2.runnerParameters = runnerParameters;
  }
});

// out/actions/publish-solution/index.js
var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var core = require_core();
var actions_1 = require_actions();
var getCredentials_1 = require_getCredentials();
var getEnvironmentUrl_1 = require_getEnvironmentUrl();
var runnerParameters_1 = require_runnerParameters();
(() => __awaiter(void 0, void 0, void 0, function* () {
  if (process.env.GITHUB_ACTIONS) {
    yield main();
  }
}))();
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      core.startGroup("publish-solution:");
      yield (0, actions_1.publishSolution)({
        credentials: (0, getCredentials_1.default)(),
        environmentUrl: (0, getEnvironmentUrl_1.default)()
      }, runnerParameters_1.runnerParameters);
      core.endGroup();
    } catch (error) {
      const logger = runnerParameters_1.runnerParameters.logger;
      logger.error(`failed: ${error}`);
      core.endGroup();
    }
  });
}
exports.main = main;

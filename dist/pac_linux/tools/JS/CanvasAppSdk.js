// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


/* 
    This is code that handles communicating with the published app. Half of this code should live within the published app.
*/
var testEnginePluginName = "TestEnginePlugin";
var isPluginRegistered = false;

var callbackDictionary = {};

class TestEnginePlugin {
    contructor() {

    }

    processResult(commandInfo) {
        if (commandInfo.args[1].successful) {
            callbackDictionary[commandInfo.args[0]].complete(commandInfo.args[1].message);
        } else {
            callbackDictionary[commandInfo.args[0]].error(commandInfo.args[1].message);
        }
        delete callbackDictionary[commandInfo.args[0]];
    }
}

function executePublishedAppScript(scriptToExecute) {
    var callbackId = Core.Utility.generate128BitUUID();
    var completeablePromise = Core.Promise.createCompletablePromise();
    callbackDictionary[callbackId] = completeablePromise;
    AppMagic.Runtime.WebPlayerRuntime._appHostManager._apiHandler.invokeScriptAsync(`
        try {
            var result = ${scriptToExecute};
            Cordova.exec(function() {}, function() {}, '${testEnginePluginName}', 'processResult', ['${callbackId}', {successful: true, message: result}])
        }
        catch(err) {
            Cordova.exec(function() {}, function() {}, '${testEnginePluginName}', 'processResult', ['${callbackId}', {successful: false, message: err}])
        }`)
    return completeablePromise.promise;
}

function getOngoingActionsInPublishedApp() {
    return executePublishedAppScript("AppMagic.AuthoringTool.Runtime.existsOngoingAsync()");
}

function getControlObjectModel () {
    return executePublishedAppScript("buildControlObjectModel()");
}

function getPropertyValueFromPublishedApp(itemPath) {
    var script = `getPropertyValueFromControl(${JSON.stringify(itemPath)})`;
    return executePublishedAppScript(script);
}

function selectControl(itemPath) {
    var script = `selectControl(${JSON.stringify(itemPath)})`;
    return executePublishedAppScript(script);
}

function interactWithControl(itemPath, value) {
    var script = "";
    if (isArray(Object.values(value))) {        
        var valuesJsonArr = [];
        var values = Object.values(value);
        for (var index in values) {
            valuesJsonArr[`${index}`] = `${JSON.stringify(values[index])}`;
        }
        var valueJson = `{"${itemPath.propertyName}":${valuesJsonArr}}`;
        script = `interactWithControl(${JSON.stringify(itemPath)}, ${valueJson})`;
    } else {
        var valueJson = `{"${itemPath.propertyName}":${value}}`;
        script = `interactWithControl(${JSON.stringify(itemPath)}, ${valueJson})`;
    }
    return executePublishedAppScript(script);
}

function setPropertyValueForControl(itemPath, value) {
    if (typeof value == "object") {
        return interactWithControl(itemPath, value);
    } else if (typeof value == "string") {
        value = JSON.stringify(value);
    }
    var script = `setPropertyValueForControl(${JSON.stringify(itemPath)}, ${value})`;
    return executePublishedAppScript(script);
}

function fetchArrayItemCount(itemPath) {
    var script = `fetchArrayItemCount(${JSON.stringify(itemPath)})`;
    return executePublishedAppScript(script);
}

function isArray(obj) {
    return obj.constructor === Array;
}

/*
 These are the functions that will be called by the Test Engine
*/

var PowerAppsTestEngine = {

    getAppStatus: function () {
        if (typeof AppMagic === "undefined" || typeof AppMagic.Runtime === "undefined"
            || typeof AppMagic.Runtime.WebPlayerRuntime === "undefined" || typeof AppMagic.Runtime.WebPlayerRuntime._appHostManager === "undefined") {
            return "Loading";
        }
        if (AppMagic.Runtime.WebPlayerRuntime._appHostManager._appIsLoading) {
            return "Loading";
        }
        else {
            // Determine interaction required and error states

            // App is loaded, register plugin
            // When this is ported into PowerApps, need to do the proper plugin registration
            if (!isPluginRegistered) {
                AppMagic.Runtime.WebPlayerRuntime._appHostManager._apiHandler.registerHandler(testEnginePluginName, new TestEnginePlugin());
            }
            return getOngoingActionsInPublishedApp().then((ongoingAppActionRunning) => {
                if (ongoingAppActionRunning) {
                    return "Busy";
                } else {
                    return "Idle";
                }
            });
        }
    },

    buildObjectModel: function () {
        return getControlObjectModel().then((controlObjectModel) => {
            return {
                controls: controlObjectModel
            };
        })
    },

    getPropertyValue: function (itemPath) {
        return getPropertyValueFromPublishedApp(itemPath)
    },

    select: function (itemPath) {
        return selectControl(itemPath)
    },

    setPropertyValue: function (itemPath, value) {
        return setPropertyValueForControl(itemPath, value);
    },

    getItemCount: function (itemPath) {
        return fetchArrayItemCount(itemPath);
    },

    debugInfo: {
        sessionID: Core.Telemetry?.Log?._sessionId
    }
}
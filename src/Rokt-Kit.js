/* eslint-disable no-undef */
//  Copyright 2025 mParticle, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

var roktLauncherScript = 'https://apps.rokt.com/wsdk/integrations/launcher.js';

var name = 'Rokt';
var moduleId = 181;

var constructor = function () {
    var self = this;

    self.name = name;
    self.moduleId = moduleId;
    self.isInitialized = false;
    self.launcher = null;
    self.filters = {};
    self.filteredUser = {};
    self.userAttributes = {};

    function initForwarder(
        settings,
        service,
        testMode,
        trackerId,
        filteredUserAttributes
    ) {
        var accountId = settings.accountId;
        var sandboxMode = window.mParticle.getEnvironment() === 'development';
        self.userAttributes = filteredUserAttributes;

        if (testMode) {
            attachLauncher(accountId, sandboxMode);
            return;
        }

        if (!window.Rokt || !(window.Rokt && window.Rokt.currentLauncher)) {
            var target = document.head || document.body;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = roktLauncherScript;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.fetchPriority = 'high';
            script.id = 'rokt-launcher';

            script.onload = function () {
                // Once the script loads, ensure the Rokt object is available
                if (
                    window.Rokt &&
                    typeof window.Rokt.createLauncher === 'function' &&
                    window.Rokt.currentLauncher === undefined
                ) {
                    attachLauncher(accountId, sandboxMode).catch(function (
                        err
                    ) {
                        console.error('Error attaching Rokt launcher:', err);
                    });
                } else {
                    console.error(
                        'Rokt object is not available after script load.'
                    );
                }
            };

            script.onerror = function (error) {
                console.error('Error loading Rokt launcher script:', error);
            };

            target.appendChild(script);
        } else {
            console.warn('Unable to find Rokt on the page');
        }
    }

    function selectPlacements(options) {
        // https://docs.rokt.com/developers/integration-guides/web/library/select-placements-options/
        // options should contain:
        // - identifier
        // - attributes

        var attributes = (options && options.attributes) || {};
        var placementAttributes = mergeObjects(self.userAttributes, attributes);

        var userAttributeFilters = self.filters.userAttributeFilters;
        var filteredAttributes = self.filters.filterUserAttributes(
            placementAttributes,
            userAttributeFilters
        );

        self.userAttributes = filteredAttributes;

        var mpid = self.filters.filteredUser.getMPID();

        var selectPlacementsAttributes = mergeObjects(filteredAttributes, {
            mpid: mpid,
        });

        var selectPlacementsOptions = mergeObjects(options, {
            attributes: selectPlacementsAttributes,
        });

        self.launcher.selectPlacements(selectPlacementsOptions);
    }

    function onUserIdentified(filteredUser) {
        self.filteredUser = filteredUser;
        self.userAttributes = filteredUser.getAllUserAttributes();
    }

    function setUserAttribute(key, value) {
        self.userAttributes[key] = value;
    }

    function removeUserAttribute(key) {
        delete self.userAttributes[key];
    }

    function attachLauncher(accountId, sandboxMode) {
        window.Rokt.createLauncher({
            accountId: accountId,
            sandbox: sandboxMode,
        })
            .then(function (launcher) {
                // Assign the launcher to a global variable for later access
                window.Rokt.currentLauncher = launcher;

                // Locally cache the launcher and filters
                self.launcher = launcher;
                self.filters = window.mParticle.Rokt.filters;

                // Attaches the kit to the Rokt manager
                window.mParticle.Rokt.attachKit(self);

                self.isInitialized = true;
            })
            .catch(function (err) {
                console.error('Error creating Rokt launcher:', err);
            });
    }

    // Called by the mParticle Rokt Manager
    this.selectPlacements = selectPlacements;

    // mParticle Kit Callback Methods
    this.init = initForwarder;
    this.setUserAttribute = setUserAttribute;
    this.onUserIdentified = onUserIdentified;
    this.removeUserAttribute = removeUserAttribute;
};

function getId() {
    return moduleId;
}

function register(config) {
    if (!config) {
        window.console.log(
            'You must pass a config object to register the kit ' + name
        );
        return;
    }
    if (!isObject(config)) {
        window.console.log(
            "'config' must be an object. You passed in a " + typeof config
        );
        return;
    }

    if (isObject(config.kits)) {
        config.kits[name] = {
            constructor: constructor,
        };
    } else {
        config.kits = {};
        config.kits[name] = {
            constructor: constructor,
        };
    }
    window.console.log(
        'Successfully registered ' + name + ' to your mParticle configuration'
    );
}

function isObject(val) {
    return (
        val != null && typeof val === 'object' && Array.isArray(val) === false
    );
}

function mergeObjects() {
    var resObj = {};
    for (var i = 0; i < arguments.length; i += 1) {
        var obj = arguments[i],
            keys = Object.keys(obj);
        for (var j = 0; j < keys.length; j += 1) {
            resObj[keys[j]] = obj[keys[j]];
        }
    }
    return resObj;
}

if (window && window.mParticle && window.mParticle.addForwarder) {
    window.mParticle.addForwarder({
        name: name,
        constructor: constructor,
        getId: getId,
    });
}

module.exports = {
    register: register,
};

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

    /**
     * Passes attributes to the Rokt Web SDK for client-side hashing
     * @see https://docs.rokt.com/developers/integration-guides/web/library/integration-launcher#hash-attributes
     * @param {Object} attributes - The attributes to be hashed
     * @returns {Promise<Object|null>} A Promise resolving to the
     * hashed attributes from the launcher, or `null` if the kit is not initialized
     */
    function hashAttributes(attributes) {
        if (!isInitialized()) {
            console.error('Rokt Kit: Not initialized');
            return null;
        }
        return self.launcher.hashAttributes(attributes);
    }

    function initForwarder(
        settings,
        _service,
        testMode,
        _trackerId,
        filteredUserAttributes,
        _filteredUserIdentities,
        _appVersion,
        _appName,
        _customFlags
    ) {
        var accountId = settings.accountId;
        self.userAttributes = filteredUserAttributes;
        self.onboardingExpProvider = settings.onboardingExpProvider;

        var managerOptions = window.mParticle.Rokt.managerOptions || {};
        var sandbox = managerOptions.sandbox || false;

        var launcherOptions = window.mParticle.Rokt.launcherOptions || {};
        launcherOptions.integrationName = generateIntegrationName(
            launcherOptions.integrationName
        );

        if (testMode) {
            attachLauncher(accountId, sandbox, launcherOptions);
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
                    attachLauncher(accountId, sandbox, launcherOptions);
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

    /**
     * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options
     * @see https://docs.rokt.com/developers/integration-guides/web/library/select-placements-options/
     * @param {Object} options - The options object for selecting placements containing:
     * - identifier {string}: The placement identifier
     * - attributes {Object}: Optional attributes to merge with existing attributes
     * @returns {Promise<void>} A Promise resolving to the Rokt launcher's selectPlacements method with processed attributes
     */
    function selectPlacements(options) {
        var attributes = (options && options.attributes) || {};
        var placementAttributes = mergeObjects(self.userAttributes, attributes);

        var filters = self.filters || {};
        var userAttributeFilters = filters.userAttributeFilters || [];
        var filteredUser = filters.filteredUser || {};
        var mpid =
            filteredUser &&
            filteredUser.getMPID &&
            typeof filteredUser.getMPID === 'function'
                ? filteredUser.getMPID()
                : null;

        var filteredAttributes;

        if (!filters) {
            console.warn(
                'Rokt Kit: No filters available, using user attributes'
            );

            filteredAttributes = placementAttributes;
        } else if (filters.filterUserAttributes) {
            filteredAttributes = filters.filterUserAttributes(
                placementAttributes,
                userAttributeFilters
            );
        }

        self.userAttributes = filteredAttributes;

        var optimizelyAttributes =
            self.onboardingExpProvider === 'Optimizely'
                ? fetchOptimizely()
                : {};

        var selectPlacementsAttributes = mergeObjects(
            filteredAttributes,
            optimizelyAttributes,
            {
                mpid: mpid,
            }
        );

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

    function attachLauncher(accountId, sandbox, launcherOptions) {
        var options = mergeObjects(
            {
                accountId: accountId,
                sandbox: sandbox,
            },
            launcherOptions || {}
        );

        window.Rokt.createLauncher(options)
            .then(function (launcher) {
                // Assign the launcher to a global variable for later access
                window.Rokt.currentLauncher = launcher;

                // Locally cache the launcher and filters
                self.launcher = launcher;

                var roktFilters = window.mParticle.Rokt.filters;

                if (!roktFilters) {
                    console.warn('Rokt Kit: No filters have been set.');
                } else {
                    self.filters = roktFilters;
                    if (!roktFilters.filteredUser) {
                        console.warn(
                            'Rokt Kit: No filtered user has been set.'
                        );
                    } else {
                        self.filteredUser = roktFilters.filteredUser;
                    }
                }

                // Attaches the kit to the Rokt manager
                window.mParticle.Rokt.attachKit(self);

                self.isInitialized = true;
            })
            .catch(function (err) {
                console.error('Error creating Rokt launcher:', err);
            });
    }

    // mParticle Kit Callback Methods
    function fetchOptimizely() {
        var forwarders = window.mParticle
            ._getActiveForwarders()
            .filter(function (forwarder) {
                return forwarder.name === 'Optimizely';
            });

        try {
            if (forwarders.length > 0 && window.optimizely) {
                // Get the state object
                var optimizelyState = window.optimizely.get('state');
                if (
                    !optimizelyState ||
                    !optimizelyState.getActiveExperimentIds
                ) {
                    return {};
                }
                // Get active experiment IDs
                var activeExperimentIds =
                    optimizelyState.getActiveExperimentIds();
                // Get variations for each active experiment
                var activeExperiments = activeExperimentIds.reduce(function (
                    acc,
                    expId
                ) {
                    acc[
                        'rokt.custom.optimizely.experiment.' +
                            expId +
                            '.variationId'
                    ] = optimizelyState.getVariationMap()[expId].id;
                    return acc;
                },
                {});
                return activeExperiments;
            }
        } catch (error) {
            console.error('Error fetching Optimizely attributes:', error);
        }
        return {};
    }

    // Called by the mParticle Rokt Manager
    this.selectPlacements = selectPlacements;
    this.hashAttributes = hashAttributes;

    // Kit Callback Methods
    this.init = initForwarder;
    this.setUserAttribute = setUserAttribute;
    this.onUserIdentified = onUserIdentified;
    this.removeUserAttribute = removeUserAttribute;

    /**
     * Checks if the kit is properly initialized and ready for use.
     * Both conditions must be true:
     * 1. self.isInitialized - Set after successful initialization of the kit
     * 2. self.launcher - The Rokt launcher instance must be available
     * @returns {boolean} Whether the kit is fully initialized
     */
    function isInitialized() {
        return !!(self.isInitialized && self.launcher);
    }
};

function generateIntegrationName(customIntegrationName) {
    var coreSdkVersion = window.mParticle.getVersion();
    var kitVersion = process.env.PACKAGE_VERSION;
    var name = 'mParticle_' + 'wsdkv_' + coreSdkVersion + '_kitv_' + kitVersion;

    if (customIntegrationName) {
        name += '_' + customIntegrationName;
    }
    return name;
}

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

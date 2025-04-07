var RoktKit = (function (exports) {
    'use strict';

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
            self.onboardingExpProvider = settings.onboardingExpProvider;

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
                        attachLauncher(accountId, sandboxMode);
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

        function attachLauncher(accountId, sandboxMode) {
            window.Rokt.createLauncher({
                accountId: accountId,
                sandbox: sandboxMode,
                integrationName:
                    'mParticle_' +
                    'wsdkv_' +
                    window.mParticle.getVersion() +
                    '_kitv_' +
                    "1.0.0",
            })
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

        // Called by the mParticle Rokt Manager
        this.selectPlacements = selectPlacements;

        // mParticle Kit Callback Methods
        function fetchOptimizely() {
            var forwarders = window.mParticle
                ._getActiveForwarders()
                .filter(function (forwarder) {
                    return forwarder.name === 'Optimizely';
                });

            try {
                if (forwarders.length > 0 || window.optimizely) {
                    // Get the state object
                    var optimizelyState = window.optimizely.get('state');
                    if (!optimizelyState || !optimizelyState.getActiveExperimentIds) {
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

    var RoktKit = {
        register: register,
    };
    var RoktKit_1 = RoktKit.register;

    exports.default = RoktKit;
    exports.register = RoktKit_1;

    return exports;

}({}));

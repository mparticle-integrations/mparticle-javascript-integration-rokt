/* eslint-env es6, mocha */
/* eslint-parser babel-eslint */

const waitForCondition = async (conditionFn, timeout = 200, interval = 10) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        (function poll() {
            if (conditionFn()) {
                return resolve(undefined);
            } else if (Date.now() - startTime > timeout) {
                return reject(new Error('Timeout waiting for condition'));
            } else {
                setTimeout(poll, interval);
            }
        })();
    });
};

describe('Rokt Forwarder', () => {
    var ReportingService = function () {
        var self = this;

        this.id = null;
        this.event = null;

        this.cb = function (forwarder, event) {
            self.id = forwarder.id;
            self.event = event;
        };

        this.reset = function () {
            this.id = null;
            this.event = null;
        };
    };
    var reportService = new ReportingService();

    // -------------------DO NOT EDIT ANYTHING ABOVE THIS LINE-----------------------
    // -------------------START EDITING BELOW:-----------------------
    // -------------------mParticle stubs - Add any additional stubbing to our methods as needed-----------------------
    mParticle.getEnvironment = function () {
        return 'development';
    };
    mParticle.getVersion = function () {
        return '1.2.3';
    };
    mParticle.Identity = {
        getCurrentUser: function () {
            return {
                getMPID: function () {
                    return '123';
                },
            };
        },
    };
    mParticle._getActiveForwarders = function () {
        return [];
    };
    // -------------------START EDITING BELOW:-----------------------
    var MockRoktForwarder = function () {
        var self = this;

        this.initializeCalled = false;
        this.isInitialized = false;
        this.accountId = null;
        this.sandbox = null;
        this.integrationName = null;
        this.createLauncherCalled = false;

        this.createLauncher = function (options) {
            self.accountId = options.accountId;
            self.integrationName = options.integrationName;
            self.noFunctional = options.noFunctional;
            self.noTargeting = options.noTargeting;
            self.createLauncherCalled = true;
            self.isInitialized = true;
            self.sandbox = options.sandbox;

            return Promise.resolve({
                then: function (callback) {
                    callback();
                },
            });
        };

        this.currentLauncher = function () {};
    };

    before(() => {});

    beforeEach(() => {
        window.Rokt = new MockRoktForwarder();
        window.mParticle.Rokt = window.Rokt;
    });

    afterEach(() => {
        window.mParticle.forwarder.userAttributes = {};
        delete window.mParticle.forwarder.launcherOptions;
        delete window.mParticle.Rokt.launcherOptions;
    });

    describe('#initForwarder', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;
                Promise.resolve();
            };
            window.mParticle.Rokt.filters = {
                userAttributesFilters: [],
                filterUserAttributes: function (attributes) {
                    return attributes;
                },
                filteredUser: {
                    getMPID: function () {
                        return '123';
                    },
                },
            };
        });

        it('should initialize the Rokt Web SDK', async () => {
            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {}
            );

            window.Rokt.accountId.should.equal('123456');
            window.Rokt.createLauncherCalled.should.equal(true);
        });

        it('should set sandbox to true if sandbox is true in launcherOptions', async () => {
            window.mParticle.Rokt.launcherOptions = {
                sandbox: true,
            };

            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );

            window.Rokt.createLauncherCalled.should.equal(true);
            window.Rokt.sandbox.should.equal(true);
        });

        it('should set sandbox to false if sandbox is false in launcherOptions', async () => {
            window.mParticle.Rokt.launcherOptions = {
                sandbox: false,
            };

            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );

            window.Rokt.createLauncherCalled.should.equal(true);
            window.Rokt.sandbox.should.equal(false);
        });

        it('should set optional settings from launcherOptions', async () => {
            window.mParticle.Rokt.launcherOptions = {
                integrationName: 'customName',
                noFunctional: true,
                noTargeting: true,
            };

            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {},
                null,
                null,
                null
            );

            var expectedIntegrationName =
                'mParticle_wsdkv_1.2.3_kitv_' +
                require('../../package.json').version +
                '_customName';

            window.Rokt.createLauncherCalled.should.equal(true);
            window.Rokt.accountId.should.equal('123456');
            window.Rokt.integrationName.should.equal(expectedIntegrationName);
            window.Rokt.noFunctional.should.equal(true);
            window.Rokt.noTargeting.should.equal(true);
        });

        it('should set the filters on the forwarder', async () => {
            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {}
            );

            // Wait for initialization to complete (after launcher is created)
            await waitForCondition(() => {
                return window.mParticle.forwarder.isInitialized;
            });

            window.mParticle.Rokt.kit.filters.should.deepEqual({
                userAttributesFilters: [],
                filterUserAttributes: function (attributes) {
                    return attributes;
                },
                filteredUser: {
                    getMPID: function () {
                        return '123';
                    },
                },
            });

            window.mParticle.Rokt.kit.filters.filteredUser
                .getMPID()
                .should.equal('123');
        });

        it('should set integrationName in the correct format', async () => {
            const packageVersion = require('../../package.json').version;
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async () => {
                window.mParticle.Rokt.attachKitCalled = true;
                return Promise.resolve();
            };

            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );

            window.Rokt.integrationName.should.equal(
                'mParticle_wsdkv_1.2.3_kitv_' + packageVersion
            );
        });

        it('should append custom integration name to integrationName if passed in launcherOptions', async () => {
            const packageVersion = require('../../package.json').version;
            const customIntegrationName = 'myCustomIntegration';

            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async () => {
                window.mParticle.Rokt.attachKitCalled = true;
                return Promise.resolve();
            };
            window.mParticle.Rokt.launcherOptions = {
                integrationName: customIntegrationName,
            };

            // Simulate the forwarder appending the custom integration name
            window.Rokt.integrationName =
                'mParticle_wsdkv_1.2.3_kitv_' +
                packageVersion +
                '_' +
                customIntegrationName;

            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {},
                null,
                null,
                null
            );

            window.Rokt.integrationName.should.equal(
                'mParticle_wsdkv_1.2.3_kitv_' +
                    packageVersion +
                    '_' +
                    customIntegrationName
            );
        });
    });

    describe('#hashAttributes', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;
                Promise.resolve();
            };
            window.mParticle.forwarder.launcher = {
                hashAttributes: function (attributes) {
                    // Mocking the hashAttributes method to show that
                    // the attributes will be transformed by the launcher's
                    // hashAttributes method.
                    const hashedAttributes = {};
                    for (const key in attributes) {
                        if (attributes.hasOwnProperty(key)) {
                            hashedAttributes[key + '-hash'] =
                                'hashed-' + attributes[key];
                        }
                    }
                    window.mParticle.Rokt.hashedAttributes = hashedAttributes;
                    window.mParticle.Rokt.hashAttributesCalled = true;

                    return Promise.resolve(hashedAttributes);
                },
            };
        });

        it('should call launcher.hashAttributes with passed through attributes when fully initialized', function () {
            // Ensure both initialization conditions are met
            window.mParticle.forwarder.isInitialized = true;
            window.mParticle.forwarder.launcher = {
                hashAttributes: function (attributes) {
                    window.mParticle.Rokt.hashAttributesOptions = attributes;
                    window.mParticle.Rokt.hashAttributesCalled = true;
                    return {
                        'test-attribute': 'hashed-value',
                    };
                },
            };

            var attributes = {
                'test-attribute': 'test-value',
            };

            window.mParticle.forwarder.hashAttributes(attributes);

            window.Rokt.hashAttributesCalled.should.equal(true);
            window.Rokt.hashAttributesOptions.should.deepEqual(attributes);
        });

        it('should return null when launcher exists but kit is not initialized', function () {
            // Set launcher but ensure isInitialized is false
            window.mParticle.forwarder.isInitialized = false;
            window.mParticle.forwarder.launcher = {
                hashAttributes: function () {},
            };

            var result = window.mParticle.forwarder.hashAttributes({
                'test-attribute': 'test-value',
            });

            (result === null).should.equal(true);
        });

        it('should log an error when called before initialization', function () {
            var errorLogged = false;
            var errorMessage = null;
            window.console.error = function (message) {
                errorLogged = true;
                errorMessage = message;
            };

            // Ensure kit is not initialized
            window.mParticle.forwarder.isInitialized = false;
            window.mParticle.forwarder.launcher = null;

            window.mParticle.forwarder.hashAttributes({
                'test-attribute': 'test-value',
            });

            errorLogged.should.equal(true);
            errorMessage.should.equal('Rokt Kit: Not initialized');
        });

        it('should return null when kit is initialized but launcher is missing', function () {
            // Mock isInitialized but remove launcher
            window.mParticle.forwarder.isInitialized = true;
            window.mParticle.forwarder.launcher = null;

            var result = window.mParticle.forwarder.hashAttributes({
                'test-attribute': 'test-value',
            });

            (result === null).should.equal(true);
        });

        it('should log an error when kit is initialized but launcher is missing', function () {
            var errorLogged = false;
            var errorMessage = null;
            window.console.error = function (message) {
                errorLogged = true;
                errorMessage = message;
            };

            window.mParticle.forwarder.isInitialized = true;
            window.mParticle.forwarder.launcher = null;

            window.mParticle.forwarder.hashAttributes({
                'test-attribute': 'test-value',
            });

            errorLogged.should.equal(true);
            errorMessage.should.equal('Rokt Kit: Not initialized');
        });

        it('should return hashed attributes from launcher', async () => {
            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {}
            );

            const result = await window.mParticle.forwarder.hashAttributes({
                'test-attribute': 'test-value',
            });

            result.should.deepEqual({
                'test-attribute-hash': 'hashed-test-value',
            });
        });
    });

    describe('#selectPlacements', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKit = async () => {
                window.mParticle.Rokt.attachKitCalled = true;
                return Promise.resolve();
            };
            window.mParticle.forwarder.launcher = {
                selectPlacements: function (options) {
                    window.mParticle.Rokt.selectPlacementsOptions = options;
                    window.mParticle.Rokt.selectPlacementsCalled = true;
                },
            };
            window.mParticle.forwarder.filters = {
                userAttributesFilters: [],
                filterUserAttributes: function (attributes) {
                    return attributes;
                },
                filteredUser: {
                    getMPID: function () {
                        return '123';
                    },
                },
            };
        });

        describe('Default initialization', () => {
            it('should call launcher.selectPlacements with all passed through options', async () => {
                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {}
                );

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {
                        test: 'test',
                    },
                });

                window.Rokt.selectPlacementsCalled.should.equal(true);
                window.Rokt.selectPlacementsOptions.should.deepEqual({
                    identifier: 'test-placement',
                    attributes: {
                        test: 'test',
                        mpid: '123',
                    },
                });
            });

            it('should collect mpid and send to launcher.selectPlacements', async () => {
                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {
                        'user-attribute': 'user-attribute-value',
                    }
                );

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {
                        'user-attribute': 'user-attribute-value',
                    },
                });

                window.Rokt.selectPlacementsCalled.should.equal(true);
                window.Rokt.selectPlacementsOptions.should.deepEqual({
                    identifier: 'test-placement',
                    attributes: {
                        'user-attribute': 'user-attribute-value',
                        mpid: '123',
                    },
                });
            });
        });

        describe('User Attributes', () => {
            it('should call launcher.selectPlacements with filtered user attributes', async () => {
                window.mParticle.forwarder.filters.filterUserAttributes =
                    function () {
                        return {
                            'user-attribute': 'user-attribute-value',
                            'unfiltered-attribute': 'unfiltered-value',
                        };
                    };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {}
                );

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {
                        'unfiltered-attribute': 'unfiltered-value',
                        'filtered-attribute': 'filtered-value',
                    },
                });

                window.Rokt.selectPlacementsCalled.should.equal(true);
                window.Rokt.selectPlacementsOptions.should.deepEqual({
                    identifier: 'test-placement',
                    attributes: {
                        'user-attribute': 'user-attribute-value',
                        'unfiltered-attribute': 'unfiltered-value',
                        mpid: '123',
                    },
                });
            });

            it('should filter user attributes through filterUserAttributes function before sending to selectPlacements', async () => {
                // Mocked filterUserAttributes function will return filtered attributes
                // based on the config passed in the init method and will ultimately
                // remove any attributes from the init method that are filtered.
                // Also, any initial attributes from the init call that have updated
                // durring runtime should be returned by the filterUserAttribute method.
                window.mParticle.forwarder.filters.filterUserAttributes =
                    function () {
                        return {
                            'user-attribute': 'user-attribute-value',
                            'unfiltered-attribute': 'unfiltered-value',
                            'changed-attribute': 'new-value',
                        };
                    };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {
                        // These should be filtered out
                        'blocked-attribute': 'blocked-value',
                        'initial-user-attribute':
                            'initial-user-attribute-value',

                        // This should be updated
                        'changed-attribute': 'old-value',
                    }
                );

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {
                        // This should pass through
                        'unfiltered-attribute': 'unfiltered-value',

                        // This should be filtered out
                        'filtered-attribute': 'filtered-value',
                    },
                });

                window.Rokt.selectPlacementsCalled.should.equal(true);
                window.Rokt.selectPlacementsOptions.should.deepEqual({
                    identifier: 'test-placement',
                    attributes: {
                        'user-attribute': 'user-attribute-value',
                        'unfiltered-attribute': 'unfiltered-value',
                        'changed-attribute': 'new-value',
                        mpid: '123',
                    },
                });
            });
        });

        describe('Identity handling', () => {
            beforeEach(() => {
                window.Rokt = new MockRoktForwarder();
                window.mParticle.Rokt = window.Rokt;
                window.mParticle.Rokt.attachKitCalled = false;
                window.mParticle.Rokt.attachKit = async (kit) => {
                    window.mParticle.Rokt.attachKitCalled = true;
                    window.mParticle.Rokt.kit = kit;
                    Promise.resolve();
                };
                window.mParticle.forwarder.launcher = {
                    selectPlacements: function (options) {
                        window.mParticle.Rokt.selectPlacementsOptions = options;
                        window.mParticle.Rokt.selectPlacementsCalled = true;
                    },
                };
            });

            it('should send userAttributes if userIdentities is null but userAttributes exists', async () => {
                window.mParticle.Rokt.filters = {
                    userAttributeFilters: [],
                    filterUserAttributes: function (attributes) {
                        return attributes;
                    },
                    filteredUser: {
                        getMPID: function () {
                            return 'abc';
                        },
                        getUserIdentities: function () {
                            return { userIdentities: {} };
                        },
                    },
                };

                // Set up the createLauncher to properly resolve asynchronously
                window.Rokt.createLauncher = async function () {
                    return Promise.resolve({
                        selectPlacements: function (options) {
                            window.mParticle.Rokt.selectPlacementsOptions =
                                options;
                            window.mParticle.Rokt.selectPlacementsCalled = true;
                        },
                    });
                };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {
                        'test-attribute': 'test-value',
                    }
                );

                // Wait for initialization to complete (after launcher is created)
                await waitForCondition(() => {
                    return window.mParticle.forwarder.isInitialized;
                });

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {},
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        'test-attribute': 'test-value',
                        mpid: 'abc',
                    }
                );
            });

            it('should send userIdentities when userAttributes is null but userIdentities exists', async () => {
                window.mParticle.Rokt.filters = {
                    userAttributeFilters: [],
                    filterUserAttributes: function () {
                        return {};
                    },
                    filteredUser: {
                        getMPID: function () {
                            return '234';
                        },
                        getUserIdentities: function () {
                            return {
                                userIdentities: {
                                    customerid: 'customer123',
                                    email: 'test@example.com',
                                },
                            };
                        },
                    },
                };

                // Set up the createLauncher to properly resolve asynchronously
                window.Rokt.createLauncher = async function () {
                    return Promise.resolve({
                        selectPlacements: function (options) {
                            window.mParticle.Rokt.selectPlacementsOptions =
                                options;
                            window.mParticle.Rokt.selectPlacementsCalled = true;
                        },
                    });
                };
                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {}
                );
                // Wait for initialization to complete (after launcher is created)
                await waitForCondition(() => {
                    return window.mParticle.forwarder.isInitialized;
                });

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {},
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        customerid: 'customer123',
                        email: 'test@example.com',
                        mpid: '234',
                    }
                );
            });

            it('should send userAttributes and userIdentities if both exist', async () => {
                window.mParticle.Rokt.filters = {
                    userAttributeFilters: [],
                    filterUserAttributes: function (attributes) {
                        return attributes;
                    },
                    filteredUser: {
                        getMPID: function () {
                            return '123';
                        },
                        getUserIdentities: function () {
                            return {
                                userIdentities: {
                                    customerid: 'customer123',
                                    email: 'test@example.com',
                                },
                            };
                        },
                    },
                };

                // Set up the createLauncher to properly resolve asynchronously
                window.Rokt.createLauncher = async function () {
                    return Promise.resolve({
                        selectPlacements: function (options) {
                            window.mParticle.Rokt.selectPlacementsOptions =
                                options;
                            window.mParticle.Rokt.selectPlacementsCalled = true;
                        },
                    });
                };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {
                        'test-attribute': 'test-value',
                    }
                );

                // Wait for initialization to complete (after launcher is created)
                await waitForCondition(() => {
                    return window.mParticle.forwarder.isInitialized;
                });

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {},
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        'test-attribute': 'test-value',
                        customerid: 'customer123',
                        email: 'test@example.com',
                        mpid: '123',
                    }
                );
            });

            it('should not send userIdentities if filteredUser is null', async () => {
                window.mParticle.Rokt.filters = {
                    userAttributeFilters: [],
                    filterUserAttributes: function (attributes) {
                        return attributes;
                    },
                    filteredUser: null,
                };

                // Set up the createLauncher to properly resolve asynchronously
                window.Rokt.createLauncher = async function () {
                    return Promise.resolve({
                        selectPlacements: function (options) {
                            window.mParticle.Rokt.selectPlacementsOptions =
                                options;
                            window.mParticle.Rokt.selectPlacementsCalled = true;
                        },
                    });
                };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {
                        'test-attribute': 'test-value',
                    }
                );

                // Wait for initialization to complete (after launcher is created)
                await waitForCondition(() => {
                    return window.mParticle.forwarder.isInitialized;
                });

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {},
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        'test-attribute': 'test-value',
                        mpid: null,
                    }
                );
            });

            it('should not send userIdentities if getUserIdentities function does not exist', async () => {
                window.mParticle.Rokt.filters = {
                    userAttributeFilters: [],
                    filterUserAttributes: function (attributes) {
                        return attributes;
                    },
                    filteredUser: {
                        getMPID: function () {
                            return '123';
                        },
                        // getUserIdentities is intentionally missing
                    },
                };

                window.Rokt.createLauncher = async function () {
                    return Promise.resolve({
                        selectPlacements: function (options) {
                            window.mParticle.Rokt.selectPlacementsOptions =
                                options;
                            window.mParticle.Rokt.selectPlacementsCalled = true;
                        },
                    });
                };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true,
                    null,
                    {
                        'test-attribute': 'test-value',
                    }
                );

                // Wait for initialization to complete (after launcher is created)
                await waitForCondition(() => {
                    return window.mParticle.forwarder.isInitialized;
                });

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {},
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        'test-attribute': 'test-value',
                        mpid: '123',
                    }
                );
            });
        });
    });

    describe('#setUserAttribute', () => {
        it('should set the user attribute', async () => {
            window.mParticle.forwarder.setUserAttribute(
                'test-attribute',
                'test-value'
            );

            window.mParticle.forwarder.userAttributes.should.deepEqual({
                'test-attribute': 'test-value',
            });
        });
    });

    describe('#removeUserAttribute', () => {
        it('should remove the user attribute', async () => {
            window.mParticle.forwarder.setUserAttribute(
                'test-attribute',
                'test-value'
            );

            window.mParticle.forwarder.removeUserAttribute('test-attribute');

            window.mParticle.forwarder.userAttributes.should.deepEqual({});
        });
    });

    describe('#onUserIdentified', () => {
        it('should set the filtered user', async () => {
            window.mParticle.forwarder.onUserIdentified({
                getAllUserAttributes: function () {
                    return {
                        'test-attribute': 'test-value',
                    };
                },
                getMPID: function () {
                    return '123';
                },
            });

            window.mParticle.forwarder.userAttributes.should.deepEqual({
                'test-attribute': 'test-value',
            });

            window.mParticle.forwarder.filters.filteredUser
                .getMPID()
                .should.equal('123');
        });
    });

    describe('#fetchOptimizely', () => {
        // Helper functions for setting up Optimizely mocks
        function setupValidOptimizelyMock(experiments) {
            window.optimizely = {
                get: function (key) {
                    if (key === 'state') {
                        return {
                            getActiveExperimentIds: function () {
                                return Object.keys(experiments);
                            },
                            getVariationMap: function () {
                                return experiments;
                            },
                        };
                    }
                },
            };
        }

        function setupInvalidOptimizelyMock(stateObject) {
            window.optimizely = {
                get: function (key) {
                    if (key === 'state') {
                        return stateObject;
                    }
                },
            };
        }

        // Common test setup
        async function initAndSelectPlacements(settings = {}) {
            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                    ...settings,
                },
                reportService.cb,
                true,
                null,
                {}
            );

            await window.mParticle.forwarder.selectPlacements({
                identifier: 'test-placement',
                attributes: {
                    test: 'test',
                },
            });
        }

        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;
                Promise.resolve();
            };
            window.mParticle.forwarder.launcher = {
                selectPlacements: function (options) {
                    window.mParticle.Rokt.selectPlacementsOptions = options;
                    window.mParticle.Rokt.selectPlacementsCalled = true;
                },
            };
            window.mParticle.Rokt.filters = {
                userAttributesFilters: [],
                filterUserAttributes: function (attributes) {
                    return attributes;
                },
                filteredUser: {
                    getMPID: function () {
                        return '123';
                    },
                },
            };
            window.mParticle._getActiveForwarders = function () {
                return [{ name: 'Optimizely' }];
            };
        });

        afterEach(() => {
            delete window.optimizely;
        });

        describe('when Optimizely is properly configured', () => {
            it('should fetch experiment data for single experiment', async () => {
                setupValidOptimizelyMock({
                    exp1: { id: 'var1' },
                });

                await initAndSelectPlacements({
                    onboardingExpProvider: 'Optimizely',
                });

                window.Rokt.selectPlacementsOptions.attributes.should.have.property(
                    'rokt.custom.optimizely.experiment.exp1.variationId',
                    'var1'
                );
            });

            it('should fetch experiment data for multiple experiments', async () => {
                setupValidOptimizelyMock({
                    exp1: { id: 'var1' },
                    exp2: { id: 'var2' },
                });

                await initAndSelectPlacements({
                    onboardingExpProvider: 'Optimizely',
                });

                const attributes =
                    window.Rokt.selectPlacementsOptions.attributes;
                attributes.should.have.property(
                    'rokt.custom.optimizely.experiment.exp1.variationId',
                    'var1'
                );
                attributes.should.have.property(
                    'rokt.custom.optimizely.experiment.exp2.variationId',
                    'var2'
                );
            });
        });

        describe('when Optimizely is not properly configured', () => {
            it('should return empty object when Optimizely is not available', async () => {
                delete window.optimizely;

                await initAndSelectPlacements({
                    onboardingExpProvider: 'Optimizely',
                });

                window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                    'rokt.custom.optimizely'
                );
            });

            it('should return empty object when Optimizely state is undefined', async () => {
                setupInvalidOptimizelyMock(undefined);

                await initAndSelectPlacements({
                    onboardingExpProvider: 'Optimizely',
                });

                window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                    'rokt.custom.optimizely'
                );
            });

            it('should return empty object when Optimizely state has invalid format', async () => {
                setupInvalidOptimizelyMock({
                    someOtherProperty: 'value',
                    invalidFunction: function () {
                        return null;
                    },
                });

                await initAndSelectPlacements({
                    onboardingExpProvider: 'Optimizely',
                });

                window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                    'rokt.custom.optimizely'
                );
            });

            it('should return empty object when Optimizely state is missing required methods', async () => {
                setupInvalidOptimizelyMock({
                    getVariationMap: function () {
                        return {};
                    },
                    // Mocking a scenario for when getActiveExperimentIds() method is missing
                });

                await initAndSelectPlacements({
                    onboardingExpProvider: 'Optimizely',
                });

                window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                    'rokt.custom.optimizely'
                );
            });
        });

        describe('when Optimizely is not the provider', () => {
            it('should not fetch Optimizely data', async () => {
                setupValidOptimizelyMock({
                    exp1: { id: 'var1' },
                });

                await initAndSelectPlacements({
                    onboardingExpProvider: 'NotOptimizely',
                });

                window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                    'rokt.custom.optimizely'
                );
            });
        });
    });

    describe('#generateLauncherScript', () => {
        const baseUrl = 'https://apps.rokt.com/wsdk/integrations/launcher.js';

        beforeEach(() => {
            window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );
        });

        it('should return base URL when no domain is passed', () => {
            const url =
                window.mParticle.forwarder.testHelpers.generateLauncherScript();
            url.should.equal(baseUrl);
        });

        it('should return an updated base URL with CNAME when domain is passed', () => {
            window.mParticle.forwarder.testHelpers
                .generateLauncherScript('cname.rokt.com')
                .should.equal(
                    'https://cname.rokt.com/wsdk/integrations/launcher.js'
                );
        });

        it('should return base URL when no extensions are provided', () => {
            const url =
                window.mParticle.forwarder.testHelpers.generateLauncherScript(
                    []
                );
            url.should.equal(baseUrl);
        });

        it('should return base URL when extensions is null or undefined', () => {
            window.mParticle.forwarder.testHelpers
                .generateLauncherScript(null)
                .should.equal(baseUrl);

            window.mParticle.forwarder.testHelpers
                .generateLauncherScript(undefined)
                .should.equal(baseUrl);
        });

        it('should correctly append a single extension', () => {
            const url =
                window.mParticle.forwarder.testHelpers.generateLauncherScript([
                    'cos-extension-detection',
                ]);
            url.should.equal(baseUrl + '?extensions=cos-extension-detection');
        });

        it('should correctly append multiple extensions', () => {
            const url =
                window.mParticle.forwarder.testHelpers.generateLauncherScript([
                    'cos-extension-detection',
                    'experiment-monitoring',
                    'sponsored-payments-apple-pay',
                ]);
            url.should.equal(
                baseUrl +
                    '?extensions=cos-extension-detection,' +
                    'experiment-monitoring,' +
                    'sponsored-payments-apple-pay'
            );
        });
    });

    describe('#roktExtensions', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
        });

        describe('extractRoktExtensions', () => {
            it('should correctly map known extension names to their query parameters', async () => {
                window.mParticle.forwarder.testHelpers
                    .extractRoktExtensions(
                        '[{&quot;value&quot;:&quot;Coupon on Signup Extension Detection&quot;},' +
                            '{&quot;value&quot;:&quot;Experiment Monitoring&quot;},' +
                            '{&quot;value&quot;:&quot;Sponsored Payments Apple Pay&quot;},' +
                            '{&quot;value&quot;:&quot;Realtime Conversion Promotion&quot;}]'
                    )
                    .should.deepEqual([
                        'cos-extension-detection',
                        'experiment-monitoring',
                        'sponsored-payments-apple-pay',
                        'realtime-conversion-promotion',
                    ]);
            });

            it('should ignore unknown or invalid extensions', async () => {
                window.mParticle.forwarder.testHelpers
                    .extractRoktExtensions(
                        '[{&quot;value&quot;:&quot;Unknown Extension&quot;},' +
                            '{&quot;value&quot;:&quot;Experiment Monitoring&quot;},' +
                            '{&quot;invalid_key&quot;:&quot;Invalid Format&quot;},' +
                            '{&quot;value&quot;:&quot;Sponsored Payments Apple Pay&quot;}]'
                    )
                    .should.deepEqual([
                        'experiment-monitoring',
                        'sponsored-payments-apple-pay',
                    ]);
            });
        });
    });
});

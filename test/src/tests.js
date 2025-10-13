/* eslint-env es6, mocha */
/* eslint-parser babel-eslint */

const packageVersion = require('../../package.json').version;
const sdkVersion = 'mParticle_wsdkv_1.2.3';
const kitVersion = 'kitv_' + packageVersion;

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
    var EventType = {
        Unknown: 0,
        Navigation: 1,
        Location: 2,
        Search: 3,
        Transaction: 4,
        UserContent: 5,
        UserPreference: 6,
        Social: 7,
        Other: 8,
        Media: 9,
    };
    var MessageType = {
        SessionStart: 1,
        SessionEnd: 2,
        PageView: 3,
        PageEvent: 4,
        CrashReport: 5,
        OptOut: 6,
        Commerce: 16,
    };
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
    mParticle._Store = {
        localSessionAttributes: {},
    };
    mParticle._getActiveForwarders = function () {
        return [];
    };
    mParticle.generateHash = function (input) {
        return 'hashed-<' + input + '>-value';
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
        this.createLocalLauncherCalled = false;

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

        this.createLocalLauncher = function (options) {
            self.accountId = options.accountId;
            self.integrationName = options.integrationName;
            self.noFunctional = options.noFunctional;
            self.noTargeting = options.noTargeting;
            self.createLocalLauncherCalled = true;
            self.isInitialized = true;
            self.sandbox = options.sandbox;

            return {
                selectPlacements: function () {},
                hashAttributes: function () {
                    throw new Error('hashAttributes not implemented');
                },
                use: function () {
                    throw new Error('use not implemented');
                },
            };
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

            const expectedIntegrationName = `${sdkVersion}_${kitVersion}_customName`;

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
                `${sdkVersion}_${kitVersion}`
            );
        });

        it('should not mutate the global launcherOptions object during initialization', async () => {
            const originalIntegrationName = 'globalIntegrationName';

            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async () => {
                window.mParticle.Rokt.attachKitCalled = true;
                return Promise.resolve();
            };

            // Set up the global launcherOptions with a custom integration name
            window.mParticle.Rokt.launcherOptions = {
                integrationName: originalIntegrationName,
                sandbox: true,
            };

            // Store reference to verify it doesn't get mutated
            const originalLauncherOptions =
                window.mParticle.Rokt.launcherOptions;

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

            originalLauncherOptions.integrationName.should.equal(
                'globalIntegrationName'
            );
            originalLauncherOptions.sandbox.should.equal(true);

            // Verify the kit still gets the processed integration name
            const expectedProcessedName = `${sdkVersion}_${kitVersion}_${originalIntegrationName}`;
            window.Rokt.integrationName.should.equal(expectedProcessedName);
        });

        it('should initialize the kit with placement event mapping lookup from a config', async () => {
            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                    placementEventMapping: JSON.stringify([
                        {
                            jsmap: '-1484452948',
                            map: '-5208850776883573773',
                            maptype: 'EventClass.Id',
                            value: 'foo-mapped-flag',
                        },
                        {
                            jsmap: '1838502119',
                            map: '1324617889422969328',
                            maptype: 'EventClass.Id',
                            value: 'ad_viewed_test',
                        },
                    ]),
                },
                reportService.cb,
                true,
                null,
                {}
            );

            // Wait for initialization to complete (after launcher is created)
            await waitForCondition(() => window.mParticle.Rokt.isInitialized);

            window.mParticle.forwarder.placementEventMappingLookup.should.deepEqual(
                {
                    '-1484452948': 'foo-mapped-flag',
                    1838502119: 'ad_viewed_test',
                }
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

    describe('#attachLauncher', () => {
        let mockMessageQueue;

        beforeEach(() => {
            mockMessageQueue = [];

            // Reset forwarder state between tests
            window.mParticle.forwarder.isInitialized = false;

            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;

            // Set attachKit as async to allow for await calls in the test
            // This is necessary to simiulate a race condition between the
            // core sdk and the Rokt forwarder
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;

                // Call queued messages
                mockMessageQueue.forEach((message) => message());
                mockMessageQueue = [];

                return Promise.resolve();
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
            window.mParticle.config = undefined;
            Math.random = () => 1;
        });

        it('should create a remote launcher if the partner is not in the local launcher test group', async () => {
            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.Rokt.createLauncherCalled.should.equal(true);
            window.mParticle.Rokt.createLocalLauncherCalled.should.equal(false);
        });

        it('should create a local launcher if the partner is in the local launcher test group', async () => {
            window.mParticle.config = {
                isLocalLauncherEnabled: true,
            };

            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.Rokt.createLauncherCalled.should.equal(false);
            window.mParticle.Rokt.createLocalLauncherCalled.should.equal(true);
        });

        it('should create a remote launcher if the partner is in the local launcher test group but the random number is below the thresholds', async () => {
            window.mParticle.config = {
                isLocalLauncherEnabled: true,
            };

            Math.random = () => 0;

            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.Rokt.createLauncherCalled.should.equal(true);
            window.mParticle.Rokt.createLocalLauncherCalled.should.equal(false);
        });

        it('should create a local launcher if the partner is in the local launcher test group but the random number is above the thresholds', async () => {
            window.mParticle.config = {
                isLocalLauncherEnabled: true,
            };

            Math.random = () => 1;

            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.Rokt.createLauncherCalled.should.equal(false);
            window.mParticle.Rokt.createLocalLauncherCalled.should.equal(true);
        });

        it('should call attachKit', async () => {
            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

            window.mParticle.Rokt.attachKitCalled.should.equal(true);
        });

        it('should set isInitialized to true', async () => {
            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

            window.mParticle.forwarder.isInitialized.should.equal(true);
        });

        // This test is to ensure the kit is initialized before attaching to the Rokt manager
        // so we can ensure that the Rokt Manager's message queue is processed and that
        // all the isReady() checks are properly handled in by the Rokt Manager.
        // This is to validate in case a bug that was found in the Rokt Manager's
        // queueing logic regresses.
        it('should initialize the kit before calling queued messages', async () => {
            let queuedMessageCalled = false;
            let wasKitInitializedFirst = false;

            const queuedMessage = () => {
                wasKitInitializedFirst =
                    window.mParticle.Rokt.kit &&
                    window.mParticle.Rokt.kit.isInitialized;
                queuedMessageCalled = true;
            };

            mockMessageQueue.push(queuedMessage);

            await window.mParticle.forwarder.init(
                { accountId: '123456' },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.forwarder.isInitialized.should.equal(false);
            queuedMessageCalled.should.equal(false);

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

            window.mParticle.forwarder.isInitialized.should.equal(true);
            queuedMessageCalled.should.equal(true);

            wasKitInitializedFirst.should.equal(true);

            mockMessageQueue.length.should.equal(0);
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
            window.mParticle.Rokt.setLocalSessionAttribute = function (
                key,
                value
            ) {
                mParticle._Store.localSessionAttributes[key] = value;
            };
            window.mParticle.Rokt.getLocalSessionAttributes = function () {
                return mParticle._Store.localSessionAttributes;
            };
            window.mParticle.Rokt.store = window.mParticle._Store;
            window.mParticle.Rokt.store.localSessionAttributes = {};
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

            it('should collect local session attributes and send to launcher.selectPlacements', async () => {
                window.mParticle.Rokt.store.localSessionAttributes = {
                    'custom-local-attribute': true,
                    'secondary-local-attribute': true,
                };

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                        placementEventMapping: JSON.stringify([
                            {
                                jsmap: 'test-event-hash',
                                map: 'test-event-map',
                                maptype: 'EventClass.Id',
                                value: 'test-mapped-flag',
                            },
                        ]),
                    },
                    reportService.cb,
                    true
                );

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {
                        'test-attribute': 'test-value',
                    },
                });

                window.Rokt.selectPlacementsCalled.should.equal(true);
                window.Rokt.selectPlacementsOptions.should.deepEqual({
                    identifier: 'test-placement',
                    attributes: {
                        mpid: '123',
                        'test-attribute': 'test-value',
                        'custom-local-attribute': true,
                        'secondary-local-attribute': true,
                    },
                });
            });

            it('should not throw an error if getLocalSessionAttributes is not available', async () => {
                let errorLogged = false;
                const originalConsoleError = console.error;
                console.error = function (message) {
                    if (
                        message &&
                        message.indexOf &&
                        message.indexOf(
                            'Error getting local session attributes'
                        ) !== -1
                    ) {
                        errorLogged = true;
                    }
                    originalConsoleError.apply(console, arguments);
                };

                delete window.mParticle.Rokt.getLocalSessionAttributes;

                await window.mParticle.forwarder.init(
                    {
                        accountId: '123456',
                    },
                    reportService.cb,
                    true
                );

                await window.mParticle.forwarder.selectPlacements({
                    identifier: 'test-placement',
                    attributes: {
                        'test-attribute': 'test-value',
                    },
                });

                errorLogged.should.equal(false);

                console.error = originalConsoleError;
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
                window.mParticle.Rokt.setLocalSessionAttribute = function (
                    key,
                    value
                ) {
                    mParticle._Store.localSessionAttributes[key] = value;
                };
                window.mParticle.Rokt.getLocalSessionAttributes = function () {
                    return mParticle._Store.localSessionAttributes;
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

            it('should map other userIdentities to emailsha256', async () => {
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
                                    other: 'sha256-test@gmail.com',
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
                        emailsha256: 'sha256-test@gmail.com',
                        mpid: '234',
                    }
                );
            });

            it('should map other to emailsha256 when other is passed through selectPlacements', async () => {
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
                    attributes: {
                        other: 'sha256-test@gmail.com',
                    },
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        'test-attribute': 'test-value',
                        customerid: 'customer123',
                        emailsha256: 'sha256-test@gmail.com',
                        mpid: '123',
                    }
                );
            });

            it('should prioritize other passed to selectPlacements over other in userIdentities', async () => {
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
                                    other: 'not-prioritized-from-userIdentities@gmail.com',
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
                    attributes: {
                        other: 'prioritized-from-selectPlacements@gmail.com',
                    },
                });

                window.Rokt.selectPlacementsOptions.attributes.should.deepEqual(
                    {
                        'test-attribute': 'test-value',
                        customerid: 'customer123',
                        emailsha256:
                            'prioritized-from-selectPlacements@gmail.com',
                        mpid: '123',
                    }
                );
            });
        });
    });

    describe('#use', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;
                Promise.resolve();
            };
        });

        it('should call launcher.use with the provided extension name when fully initialized', async () => {
            window.mParticle.forwarder.isInitialized = true;
            window.mParticle.forwarder.launcher = {
                use: function (name) {
                    window.Rokt.useCalled = true;
                    window.Rokt.useName = name;
                    return Promise.resolve({});
                },
            };

            await window.mParticle.forwarder.use('ThankYouPageJourney');

            window.Rokt.useCalled.should.equal(true);
            window.Rokt.useName.should.equal('ThankYouPageJourney');
        });

        it('should reject when called before initialization', async () => {
            window.mParticle.forwarder.isInitialized = false;

            try {
                await window.mParticle.forwarder.use('ThankYouPageJourney');
            } catch (error) {
                error.message.should.equal('Rokt Kit: Not initialized');
            }
        });

        it('should log an error when called before initialization', async () => {
            const originalConsoleError = window.console.error;
            let errorLogged = false;
            let errorMessage = null;
            window.console.error = function (message) {
                errorLogged = true;
                errorMessage = message;
            };

            window.mParticle.forwarder.isInitialized = false;
            window.mParticle.forwarder.launcher = null;

            try {
                await window.mParticle.forwarder.use('ThankYouPageJourney');
                throw new Error('Expected promise to reject');
            } catch (error) {
                error.message.should.equal('Rokt Kit: Not initialized');
            } finally {
                window.console.error = originalConsoleError;
            }

            errorLogged.should.equal(true);
            errorMessage.should.equal('Rokt Kit: Not initialized');
        });

        it('should reject when extension name is invalid', async () => {
            window.mParticle.forwarder.isInitialized = true;
            window.mParticle.forwarder.launcher = {
                use: function () {
                    return Promise.resolve({});
                },
            };

            try {
                await window.mParticle.forwarder.use(123);
            } catch (error) {
                error.message.should.equal('Rokt Kit: Invalid extension name');
            }
        });

        it('should log an error when kit is initialized but launcher is missing', async () => {
            const originalConsoleError = window.console.error;
            let errorLogged = false;
            let errorMessage = null;
            window.console.error = function (message) {
                errorLogged = true;
                errorMessage = message;
            };

            window.mParticle.forwarder.isInitialized = true;
            window.mParticle.forwarder.launcher = null;

            try {
                await window.mParticle.forwarder.use('ThankYouPageJourney');
                throw new Error('Expected promise to reject');
            } catch (error) {
                error.message.should.equal('Rokt Kit: Not initialized');
            } finally {
                window.console.error = originalConsoleError;
            }
            errorLogged.should.equal(true);
            errorMessage.should.equal('Rokt Kit: Not initialized');
        });

        it('should call launcher.use after init (test mode) and attach', async () => {
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;
                Promise.resolve();
            };

            window.Rokt.createLauncher = async function () {
                return Promise.resolve({
                    use: function (name) {
                        window.Rokt.useCalled = true;
                        window.Rokt.useName = name;
                        return Promise.resolve({});
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

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

            await window.mParticle.forwarder.use('ThankYouPageJourney');

            window.Rokt.useCalled.should.equal(true);
            window.Rokt.useName.should.equal('ThankYouPageJourney');
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
            window.mParticle.Rokt.setLocalSessionAttribute = function (
                key,
                value
            ) {
                mParticle._Store.localSessionAttributes[key] = value;
            };
            window.mParticle.Rokt.getLocalSessionAttributes = function () {
                return mParticle._Store.localSessionAttributes;
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
                window.mParticle.forwarder.testHelpers.generateLauncherScript();
            url.should.equal(baseUrl);
        });

        it('should return base URL when extensions is null or undefined', () => {
            window.mParticle.forwarder.testHelpers
                .generateLauncherScript(undefined, null)
                .should.equal(baseUrl);

            window.mParticle.forwarder.testHelpers
                .generateLauncherScript(undefined, undefined)
                .should.equal(baseUrl);
        });

        it('should correctly append a single extension', () => {
            const url =
                window.mParticle.forwarder.testHelpers.generateLauncherScript(
                    undefined,
                    ['cos-extension-detection']
                );
            url.should.equal(baseUrl + '?extensions=cos-extension-detection');
        });

        it('should correctly append multiple extensions', () => {
            const url =
                window.mParticle.forwarder.testHelpers.generateLauncherScript(
                    undefined,
                    [
                        'cos-extension-detection',
                        'experiment-monitoring',
                        'sponsored-payments-apple-pay',
                    ]
                );
            url.should.equal(
                baseUrl +
                    '?extensions=cos-extension-detection,' +
                    'experiment-monitoring,' +
                    'sponsored-payments-apple-pay'
            );
        });
    });

    describe('#roktExtensions', () => {
        beforeEach(async () => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );
        });

        describe('extractRoktExtensions', () => {
            it('should correctly map known extension names to their query parameters', async () => {
                const settingsString =
                    '[{&quot;jsmap&quot;:null,&quot;map&quot;:null,&quot;maptype&quot;:&quot;StaticList&quot;,&quot;value&quot;:&quot;cos-extension-detection&quot;},{&quot;jsmap&quot;:null,&quot;map&quot;:null,&quot;maptype&quot;:&quot;StaticList&quot;,&quot;value&quot;:&quot;experiment-monitoring&quot;}]';
                const expectedExtensions = [
                    'cos-extension-detection',
                    'experiment-monitoring',
                ];

                window.mParticle.forwarder.testHelpers
                    .extractRoktExtensions(settingsString)
                    .should.deepEqual(expectedExtensions);
            });
        });

        it('should handle invalid setting strings', () => {
            window.mParticle.forwarder.testHelpers
                .extractRoktExtensions('NONE')
                .should.deepEqual([]);

            window.mParticle.forwarder.testHelpers
                .extractRoktExtensions(undefined)
                .should.deepEqual([]);

            window.mParticle.forwarder.testHelpers
                .extractRoktExtensions(null)
                .should.deepEqual([]);
        });
    });

    describe('#generateMappedEventLookup', () => {
        beforeEach(async () => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );
        });

        it('should generate a lookup table from a placement event mapping', () => {
            const placementEventMapping = [
                {
                    jsmap: '-1484452948',
                    map: '-5208850776883573773',
                    maptype: 'EventClass.Id',
                    value: 'foo-mapped-flag',
                },
                {
                    jsmap: '1838502119',
                    map: '1324617889422969328',
                    maptype: 'EventClass.Id',
                    value: 'ad_viewed_test',
                },
            ];

            window.mParticle.forwarder.testHelpers
                .generateMappedEventLookup(placementEventMapping)
                .should.deepEqual({
                    '-1484452948': 'foo-mapped-flag',
                    1838502119: 'ad_viewed_test',
                });
        });

        it('should return an empty object if the placement event mapping is null', () => {
            window.mParticle.forwarder.testHelpers
                .generateMappedEventLookup(null)
                .should.deepEqual({});
        });
    });

    describe('#processEvent', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.Rokt.createLauncher = async function () {
                return Promise.resolve({
                    selectPlacements: function (options) {
                        window.mParticle.Rokt.selectPlacementsOptions = options;
                        window.mParticle.Rokt.selectPlacementsCalled = true;
                    },
                });
            };
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async (kit) => {
                window.mParticle.Rokt.attachKitCalled = true;
                window.mParticle.Rokt.kit = kit;
                Promise.resolve();
            };
            window.mParticle.Rokt.setLocalSessionAttribute = function (
                key,
                value
            ) {
                window.mParticle._Store.localSessionAttributes[key] = value;
            };
            window.mParticle.Rokt.getLocalSessionAttributes = function () {
                return window.mParticle._Store.localSessionAttributes;
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
        });

        afterEach(() => {
            window.mParticle.forwarder.eventQueue = [];
            window.mParticle.forwarder.isInitialized = false;
            window.mParticle.Rokt.attachKitCalled = false;
        });

        it('set a local session selection attribute if the event is a mapped placement event', async () => {
            // Mocks hashed values for testing
            const placementEventMapping = JSON.stringify([
                {
                    jsmap: 'hashed-<48Video Watched>-value',
                    map: '123466',
                    maptype: 'EventClass.Id',
                    value: 'foo-mapped-flag',
                },
                {
                    jsmap: 'hashed-<29Other Value>-value',
                    map: '1279898989',
                    maptype: 'EventClass.Id',
                    value: 'ad_viewed_test',
                },
            ]);

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                    placementEventMapping,
                },
                reportService.cb,
                true,
                null,
                {}
            );

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

            window.mParticle.forwarder.process({
                EventName: 'Video Watched',
                EventCategory: EventType.Other,
                EventDataType: MessageType.PageEvent,
            });

            window.mParticle._Store.localSessionAttributes.should.deepEqual({
                'foo-mapped-flag': true,
            });
        });

        it('should add the event to the event queue if the kit is not initialized', async () => {
            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.forwarder.process({
                EventName: 'Video Watched A',
                EventCategory: EventType.Other,
                EventDataType: MessageType.PageEvent,
            });

            window.mParticle.forwarder.eventQueue.should.deepEqual([
                {
                    EventName: 'Video Watched A',
                    EventCategory: EventType.Other,
                    EventDataType: MessageType.PageEvent,
                },
            ]);
        });

        it('should process queued events once the kit is ready', async () => {
            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {}
            );

            window.mParticle.forwarder.process({
                EventName: 'Video Watched B',
                EventCategory: EventType.Other,
                EventDataType: MessageType.PageEvent,
            });

            window.mParticle.forwarder.eventQueue.should.deepEqual([
                {
                    EventName: 'Video Watched B',
                    EventCategory: EventType.Other,
                    EventDataType: MessageType.PageEvent,
                },
            ]);

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

            window.mParticle.forwarder.eventQueue.should.deepEqual([]);
        });
    });

    describe('#parseSettingsString', () => {
        it('should parse null values in a settings string appropriately', () => {
            const settingsString =
                '[{&quot;jsmap&quot;:null,&quot;map&quot;:&quot;f.name&quot;,&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;firstname&quot;},{&quot;jsmap&quot;:null,&quot;map&quot;:&quot;last_name&quot;,&quot;maptype&quot;:&quot;UserAttributeClass.Name&quot;,&quot;value&quot;:&quot;lastname&quot;}]';

            window.mParticle.forwarder.testHelpers
                .parseSettingsString(settingsString)
                .should.deepEqual([
                    {
                        jsmap: null,
                        map: 'f.name',
                        maptype: 'UserAttributeClass.Name',
                        value: 'firstname',
                    },
                    {
                        jsmap: null,
                        map: 'last_name',
                        maptype: 'UserAttributeClass.Name',
                        value: 'lastname',
                    },
                ]);
        });

        it('should convert jmap and map number values to stringified numbers when parsed', () => {
            const settingsString =
                '[{&quot;jsmap&quot;:&quot;-1484452948&quot;,&quot;map&quot;:&quot;-5208850776883573773&quot;,&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;abc&quot;},{&quot;jsmap&quot;:&quot;1838502119&quot;,&quot;map&quot;:&quot;1324617889422969328&quot;,&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;bcd&quot;},{&quot;jsmap&quot;:&quot;-355458063&quot;,&quot;map&quot;:&quot;5878452521714063084&quot;,&quot;maptype&quot;:&quot;EventClass.Id&quot;,&quot;value&quot;:&quot;card_viewed_test&quot;}]';

            window.mParticle.forwarder.testHelpers
                .parseSettingsString(settingsString)
                .should.deepEqual([
                    {
                        jsmap: '-1484452948',
                        map: '-5208850776883573773',
                        maptype: 'EventClass.Id',
                        value: 'abc',
                    },
                    {
                        jsmap: '1838502119',
                        map: '1324617889422969328',
                        maptype: 'EventClass.Id',
                        value: 'bcd',
                    },
                    {
                        jsmap: '-355458063',
                        map: '5878452521714063084',
                        maptype: 'EventClass.Id',
                        value: 'card_viewed_test',
                    },
                ]);
        });

        it('returns an empty array if the settings string is empty', () => {
            const settingsString = '';

            window.mParticle.forwarder.testHelpers
                .parseSettingsString(settingsString)
                .should.deepEqual([]);
        });

        it('returns an empty array if the settings string is not a valid JSON', () => {
            const settingsString = 'not a valid JSON';

            window.mParticle.forwarder.testHelpers
                .parseSettingsString(settingsString)
                .should.deepEqual([]);
        });
    });

    describe('#hashEventMessage', () => {
        it('should hash event message using generateHash in the proper order', () => {
            const eventName = 'Test Event';
            const eventType = EventType.Other;
            const messageType = MessageType.PageEvent;
            const resultHash =
                window.mParticle.forwarder.testHelpers.hashEventMessage(
                    messageType,
                    eventType,
                    eventName
                );

            // Order should be messageType (4), eventType (8), eventName (Test Event)
            resultHash.should.equal('hashed-<48Test Event>-value');
        });
    });
});

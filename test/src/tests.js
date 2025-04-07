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
            self.createLauncherCalled = true;
            self.isInitialized = true;

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

            await waitForCondition(() => window.mParticle.Rokt.attachKitCalled);

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

            window.mParticle.Rokt.kit.filteredUser
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
                    'initial-user-attribute': 'initial-user-attribute-value',

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

            window.mParticle.forwarder.filteredUser
                .getMPID()
                .should.equal('123');
        });
    });

    describe('#fetchOptimizely', () => {
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
                return [
                    {
                        name: 'Optimizely',
                    },
                ];
            };
        });

        it('should fetch Optimizely experiment data when provider is Optimizely', async () => {
            // Mock Optimizely
            window.optimizely = {
                get: function (key) {
                    if (key === 'state') {
                        return {
                            getActiveExperimentIds: function () {
                                return ['exp1', 'exp2'];
                            },
                            getVariationMap: function () {
                                return {
                                    exp1: { id: 'var1' },
                                    exp2: { id: 'var2' },
                                };
                            },
                        };
                    }
                },
            };

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                    onboardingExpProvider: 'Optimizely',
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

            window.Rokt.selectPlacementsOptions.attributes.should.have.property(
                'rokt.custom.optimizely.experiment.exp1.variationId',
                'var1'
            );
            window.Rokt.selectPlacementsOptions.attributes.should.have.property(
                'rokt.custom.optimizely.experiment.exp2.variationId',
                'var2'
            );
        });

        it('should return empty object when Optimizely is not available', async () => {
            delete window.optimizely;

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                    onboardingExpProvider: 'Optimizely',
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

            window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                'rokt.custom.optimizely'
            );
        });

        it('should return empty object when Optimizely state is invalid', async () => {
            // Mock invalid Optimizely state
            window.optimizely = {
                get: function (key) {
                    if (key === 'state') {
                        return {
                            // Missing getActiveExperimentIds method
                            getVariationMap: function () {
                                return {};
                            },
                        };
                    }
                },
            };

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                    onboardingExpProvider: 'Optimizely',
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

            window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                'rokt.custom.optimizely'
            );
        });

        it('should not fetch Optimizely data when provider is not Optimizely', async () => {
            window.optimizely = {
                get: function (key) {
                    if (key === 'state') {
                        return {
                            getActiveExperimentIds: function () {
                                return ['exp1'];
                            },
                            getVariationMap: function () {
                                return {
                                    exp1: { id: 'var1' },
                                };
                            },
                        };
                    }
                },
            };

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                    onboardingExpProvider: 'NotOptimizely',
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

            window.Rokt.selectPlacementsOptions.attributes.should.not.have.property(
                'rokt.custom.optimizely'
            );
        });
    });
});

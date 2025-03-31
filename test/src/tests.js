/* eslint-env es6, mocha */
/* eslint-parser babel-eslint */

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
    mParticle.Identity = {
        getCurrentUser: function () {
            return {
                getMPID: function () {
                    return '123';
                },
            };
        },
    };
    // -------------------START EDITING BELOW:-----------------------
    var MockRoktForwarder = function () {
        var self = this;

        this.initializeCalled = false;
        this.isInitialized = false;

        this.accountId = null;
        this.sandbox = null;

        this.createLauncherCalled = false;
        this.createLauncher = function (options) {
            self.accountId = options.accountId;
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

    beforeEach(() => {});

    describe('#initForwarder', () => {
        it('should initialize the Rokt Web SDK', async () => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKitCalled = false;
            window.mParticle.Rokt.attachKit = async () => {
                window.mParticle.Rokt.attachKitCalled = true;
                Promise.resolve();
            };

            await mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true
            );

            window.Rokt.accountId.should.equal('123456');

            window.Rokt.createLauncherCalled.should.equal(true);
        });
    });

    describe('#selectPlacements', () => {
        beforeEach(() => {
            window.Rokt = new MockRoktForwarder();
            window.mParticle.Rokt = window.Rokt;
            window.mParticle.Rokt.attachKit = async () => {
                window.mParticle.Rokt.attachKitCalled = true;
                Promise.resolve();
            };
            window.mParticle.forwarder.launcher = {
                selectPlacements: function (options) {
                    window.mParticle.Rokt.selectPlacementsOptions = options;
                    window.mParticle.Rokt.selectPlacementsCalled = true;
                },
            };
        });

        it('should call launcher.selectPlacements with all passed through options', async () => {
            window.mParticle.forwarder.filters = {
                userAttributesFilters: [],
                filterUserAttributes: function (attributes) {
                    return attributes;
                },
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
                    test: 'test',
                },
            });

            window.Rokt.selectPlacementsCalled.should.equal(true);
            window.Rokt.selectPlacementsOptions.should.deepEqual({
                identifier: 'test-placement',
                attributes: {
                    test: 'test',
                },
            });
        });

        it('should call launcher.selectPlacements with filtered user attributes', async () => {
            window.mParticle.forwarder.filters = {
                userAttributesFilters: [],
                filterUserAttributes: function () {
                    return {
                        'user-attribute': 'user-attribute-value',
                        'unfiltered-attribute': 'unfiltered-value',
                    };
                },
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
                },
            });
        });

        it('should filter user attributes through filterUserAttributes function before sending to selectPlacements', async () => {
            window.mParticle.forwarder.filters = {
                filterUserAttributes: function () {
                    return {
                        'user-attribute': 'user-attribute-value',
                        'unfiltered-attribute': 'unfiltered-value',
                    };
                },
            };

            await window.mParticle.forwarder.init(
                {
                    accountId: '123456',
                },
                reportService.cb,
                true,
                null,
                {
                    'blocked-attribute': 'blocked-value',
                    'initial-user-attribute': 'initial-user-attribute-value',
                }
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
                },
            });
        });
    });
});

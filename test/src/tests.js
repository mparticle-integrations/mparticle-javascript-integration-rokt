/* eslint-disable no-undef*/
describe('Rokt Forwarder', function () {
    // -------------------DO NOT EDIT ANYTHING BELOW THIS LINE-----------------------
    var // MessageType = {
        //     SessionStart: 1,
        //     SessionEnd: 2,
        //     PageView: 3,
        //     PageEvent: 4,
        //     CrashReport: 5,
        //     OptOut: 6,
        //     AppStateTransition: 10,
        //     Profile: 14,
        //     Commerce: 16
        // },
        // EventType = {
        //     Unknown: 0,
        //     Navigation: 1,
        //     Location: 2,
        //     Search: 3,
        //     Transaction: 4,
        //     UserContent: 5,
        //     UserPreference: 6,
        //     Social: 7,
        //     Other: 8,
        //     Media: 9,
        //     getName: function() {
        //         return 'blahblah';
        //     }
        // },
        // ProductActionType = {
        //     Unknown: 0,
        //     AddToCart: 1,
        //     RemoveFromCart: 2,
        //     Checkout: 3,
        //     CheckoutOption: 4,
        //     Click: 5,
        //     ViewDetail: 6,
        //     Purchase: 7,
        //     Refund: 8,
        //     AddToWishlist: 9,
        //     RemoveFromWishlist: 10
        // },
        IdentityType = {
            Other: 0,
            CustomerId: 1,
            Facebook: 2,
            Twitter: 3,
            Google: 4,
            Microsoft: 5,
            Yahoo: 6,
            Email: 7,
            Alias: 8,
            FacebookCustomAudienceId: 9,
        },
        ReportingService = function () {
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
        },
        reportService = new ReportingService();

    // -------------------DO NOT EDIT ANYTHING ABOVE THIS LINE-----------------------
    // -------------------START EDITING BELOW:-----------------------
    // -------------------mParticle stubs - Add any additional stubbing to our methods as needed-----------------------
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

        // create properties for each type of event you want tracked, see below for examples
        this.trackCustomEventCalled = false;
        this.logPurchaseEventCalled = false;
        this.initializeCalled = false;

        this.trackCustomName = null;
        this.logPurchaseName = null;
        this.accountId = null;
        this.sandbox = null;
        this.userId = null;
        this.userAttributes = {};
        this.userIdField = null;

        this.eventProperties = [];
        this.purchaseEventProperties = [];

        this.createLauncherCalled = false;
        this.createLauncher = function (options) {
            self.accountId = options.accountId;
            self.sandbox = options.sandbox;
            self.createLauncherCalled = true;

            return Promise.resolve({
                then: function (callback) {
                    callback();
                },
            });
        };

        this.currentLauncher = function () {};

        // stub your different methods to ensure they are being called properly
        this.initialize = function (appId, apiKey) {
            self.initializeCalled = true;
            self.apiKey = apiKey;
            self.appId = appId;
        };

        this.stubbedTrackingMethod = function (name, eventProperties) {
            self.trackCustomEventCalled = true;
            self.trackCustomName = name;
            self.eventProperties.push(eventProperties);
            // Return true to indicate event should be reported
            return true;
        };

        this.stubbedUserAttributeSettingMethod = function (userAttributes) {
            self.userId = id;
            userAttributes = userAttributes || {};
            if (Object.keys(userAttributes).length) {
                for (var key in userAttributes) {
                    if (userAttributes[key] === null) {
                        delete self.userAttributes[key];
                    } else {
                        self.userAttributes[key] = userAttributes[key];
                    }
                }
            }
        };

        this.stubbedUserLoginMethod = function (id) {
            self.userId = id;
        };
    };

    before(function () {
    });

    beforeEach(function () {
    });

    it.only('should initialize the Rokt Web SDK', async () => {
        window.Rokt = new MockRoktForwarder();
        window.mParticle.Rokt.attachLauncherCalled = false;
        window.mParticle.Rokt.attachLauncher = async (options) => {
            console.log('attachLauncher called', options);
            window.mParticle.Rokt.attachLauncherCalled = true;
            console.log('checking attachLauncherCalled top', window.mParticle.Rokt.attachLauncherCalled);
            Promise.resolve();
        };

        await mParticle.forwarder.init(
            {
                accountId: '123456',
                sandboxMode: 'True',
            },
            reportService.cb,
            true
        );

        window.Rokt.accountId.should.equal('123456');
        window.Rokt.sandbox.should.equal(true);

        window.Rokt.createLauncherCalled.should.equal(true);

        await waitForCondition(() => window.mParticle.Rokt.attachLauncherCalled === true);
    });
});

const waitForCondition = function async(
    conditionFn,
    timeout = 200,
    interval = 10
) {
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

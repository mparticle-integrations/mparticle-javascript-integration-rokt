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

        this.accountId = null;
        this.sandbox = null;

        this.createLauncherCalled = false;
        this.createLauncher = function (options) {
            self.accountId = options.accountId;
            self.createLauncherCalled = true;

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

    it('should initialize the Rokt Web SDK', async () => {
        window.Rokt = new MockRoktForwarder();
        window.mParticle.Rokt = window.Rokt;
        window.mParticle.Rokt.attachLauncherCalled = false;
        window.mParticle.Rokt.attachLauncher = async () => {
            window.mParticle.Rokt.attachLauncherCalled = true;
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

        await waitForCondition(
            () => window.mParticle.Rokt.attachLauncherCalled === true
        );
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

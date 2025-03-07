var roktLauncherScript = 'https://apps.rokt.com/wsdk/integrations/launcher.js';

var initialization = {
    name: 'RoktWsdk',
    moduleId: 181,
    /*  ****** Fill out initForwarder to load your SDK ******
    Note that not all arguments may apply to your SDK initialization.
    These are passed from mParticle, but leave them even if they are not being used.
    forwarderSettings contain settings that your SDK requires in order to initialize
    userAttributes example: {gender: 'male', age: 25}
    userIdentities example: { 1: 'customerId', 2: 'facebookId', 7: 'emailid@email.com' }
    additional identityTypes can be found at https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L88-L101
*/
    initForwarder: function (
        forwarderSettings,
        testMode,
        _userAttributes,
        _userIdentities,
        processEvent,
        eventQueue,
        _isInitialized,
        _common,
        _appVersion,
        _appName,
        _customFlags,
        _clientId
    ) {
        if (!testMode) {
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
                        window.Rokt.createLauncher({
                            accountId: forwarderSettings.accountId,
                            sandbox:
                                forwarderSettings.sandboxMode && forwarderSettings.sandboxMode  === 'True'
                                    ? true
                                    : false,
                        })
                            .then(function (launcher) {
                                // Assign the launcher to a global variable for later access
                                window.Rokt.currentLauncher = launcher;
                                if (window['Rokt'] && eventQueue.length > 0) {
                                    for (
                                        var i = 0;
                                        i < eventQueue.length;
                                        i++
                                    ) {
                                        processEvent(eventQueue[i]);
                                    }
                                    eventQueue = [];
                                }
                            })
                            .catch(function (err) {
                                console.error(
                                    'Error creating Rokt launcher:',
                                    err
                                );
                            });
                    } else {
                        console.error(
                            'Rokt object is not available after script load.'
                        );
                    }
                };

                script.onerror = function (error) {
                    console.error(
                        'Failed to load Rokt launcher script:',
                        error
                    );
                };

                target.appendChild(script);
            } else {
                // For testing, you can simulate initialization if needed.
                console.log(
                    'Test mode enabled – skipping Rokt launcher script load.'
                );
            }
        }
    },
};

module.exports = initialization;

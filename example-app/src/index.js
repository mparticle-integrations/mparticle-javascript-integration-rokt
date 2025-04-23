// Import styles
import './styles.css';

// Import mParticle SDK
import mParticle from '@mparticle/web-sdk';
import RoktKit from '@mparticle/web-rokt-kit';

// Console logger setup
(function() {
    // Store original console methods
    const origConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };

    // Add message to console element
    function addToConsole(msg, type) {
        setTimeout(function() {
            const consoleEl = document.getElementById('console');
            if (!consoleEl) return;

            const entry = document.createElement('div');
            entry.className = type || '';
            entry.textContent = typeof msg === 'object' ? JSON.stringify(msg) : msg;
            consoleEl.appendChild(entry);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }, 0);
    }

    // Override console methods
    console.log = function() {
        addToConsole(arguments[0], '');
        origConsole.log.apply(console, arguments);
    };

    console.error = function() {
        addToConsole(arguments[0], 'error');
        origConsole.error.apply(console, arguments);
    };

    console.info = function() {
        addToConsole(arguments[0], 'info');
        origConsole.info.apply(console, arguments);
    };

    console.warn = function() {
        addToConsole(arguments[0], 'warn');
        origConsole.warn.apply(console, arguments);
    };
})();

// Setup event handlers
function setupEventHandlers() {
    // Standard event handler
    const logEventButton = document.getElementById('js-log-event');
    if (logEventButton) {
        logEventButton.addEventListener('click', function() {
            console.log('Firing test event');
            mParticle.logEvent('Test Event', mParticle.EventType.Other);
        });
    }

    // Rokt offer display handler
    const showOfferButton = document.getElementById('js-show-offer');
    if (showOfferButton) {
        showOfferButton.addEventListener('click', function() {
            console.log('Show offer button clicked - requesting Rokt placement');
            showRoktOffer();
        });
    }
}

// Show Rokt offer
function showRoktOffer() {
    console.log('Checking Rokt availability...');
    console.log('mParticle:', mParticle);

    // Check if we can use mParticle.Rokt kit directly
    if (mParticle && mParticle.Rokt) {
        console.info('Using mParticle.Rokt.kit.selectPlacements');

        mParticle.Rokt.kit.selectPlacements({
            identifier: 'e2e-mp-embedded-layout',
            attributes: {
                clientType: 'DesktopWeb',
                country: 'AU',
                'rokt.testsession': 'true',
                userAgent: navigator.userAgent
            }
        });
    } else {
        console.error('Rokt Kit not properly initialized or available');
        console.log('Available mParticle.Rokt:', mParticle.Rokt);
    }
}

// Initialize mParticle when the DOM content is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.info('Page loaded - initializing Rokt');
    console.log('RoktKit', RoktKit);
    try {
        // Create a properly wrapped sideloaded kit
        const mpRoktKit = new mParticle.MPSideloadedKit(RoktKit);

        console.log('Rokt Account ID:', process.env.ROKT_ACCOUNT_ID);

        // Define mParticle configuration (following React example pattern)
        const mParticleConfig = {
            // App details
            appName: 'Rokt Kit Example App',
            requestConfig: false,
            identifyRequest: {
                userIdentities: {
                    email: "d.vader@example.com"
                }
            },
            // Development mode settings
            isDevelopmentMode: true,
            logLevel: 'verbose',

            kitConfigs: []
        };

        // Initialize mParticle with API key and config
        const apiKey = process.env.ROKT_API_KEY;

        // Add Rokt kit configuration
        mParticleConfig.kitConfigs.push({
            name: 'Rokt',
            moduleId: 181,
            isDebug: true,
            isVisible: true,
            settings: {
                accountId: process.env.ROKT_ACCOUNT_ID
            },
            screenNameFilters: [],
            screenAttributeFilters: [],
            userIdentityFilters: [],
            userAttributeFilters: [],
            eventNameFilters: [],
            eventTypeFilters: [],
            attributeFilters: [],
            filteringEventAttributeValue: null,
            filteringUserAttributeValue: null,
            excludeAnonymousUser: false
        });

        RoktKit.register(mParticleConfig);
        // Initialize mParticle
        mParticle.init(apiKey, mParticleConfig);

        // Initialize Rokt namespace and event handlers after mParticle is ready
        mParticle.ready(function() {
            console.info('mParticle is ready');
            console.log('mParticle.Rokt', mParticle.Rokt);
            // Add event listeners
            setupEventHandlers();
        });
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

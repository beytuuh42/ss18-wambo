
/**
 Test config for protractor.
 Emulating the chrome browser as a Pixel 2 XL.
 **/
exports.config = {
        capabilities: {
            'browserName': 'chrome',
            'chromeOptions': {
                args: ['--disable-web-security'],
                'mobileEmulation' : {
                    'deviceName': 'Pixel 2 XL'
                }
            },

        },
        directConnect: true,
        baseUrl: 'http://localhost:8100/',
        specs: [
            'e2e-tests/register.tests.js',
            'e2e-tests/login.tests.js',
            'e2e-tests/home.tests.js',
            'e2e-tests/post.tests.js',
            'e2e-tests/profil.tests.js'
        ],
        jasmineNodeOpts: {
            isVerbose: true,
        }
};

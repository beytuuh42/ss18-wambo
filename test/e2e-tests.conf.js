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
            'e2e-tests/**/*.tests.js'
            //'e2e-tests/post.tests.js'
        ],
        jasmineNodeOpts: {
            isVerbose: true,
        }
};

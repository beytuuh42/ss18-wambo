exports.config = {
        capabilities: {
            'browserName': 'chrome',
            'chromeOptions': {
                args: ['--disable-web-security']
            }
        },
        directConnect: true,
        baseUrl: 'http://localhost:8100/',
        specs: [
            //'e2e-tests/**/*.tests.js'
            'e2e-tests/home.tests.js'
        ],
        jasmineNodeOpts: {
            isVerbose: true,
        }
};

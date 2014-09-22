module.exports = function (config) {
    config.set({

        basePath: './',

        files: [
            'app/lib/angular/angular.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/js/app.js',

            'test/specs/app/**/*.js'
        ],

        preprocessors: {
            'app/js/**/*.js': ['coverage']
        },

        autoWatch: true,

        frameworks: ['jasmine'],

        reporters: ['progress', 'coverage'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter'
        ],

        coverageReporter: {
            type: 'lcov',
            dir: 'test/',
            subdir: 'coverage/'
        }


    });
};
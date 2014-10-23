module.exports = function (config) {
    config.set({

        basePath: './',

        files: [
            'app/lib/angular/angular.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/lib/moment/moment.js',
            'app/js/app.js',
            'app/js/**/*.js',

            'test/specs/app/**/*.js',
            'test/specs/mocks/**/*.js'
        ],

        preprocessors: {
            'app/js/**/*.js': ['coverage']
        },

        autoWatch: true,

        frameworks: ['jasmine'],

        reporters: ['progress'],

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
module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'app/lib/angular/angular.js',
            'app/lib/angular-mocks/angular-mocks.js',
            'app/js/app.js',

            'test/specs/app/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        reporters: ['progress', 'junit'],

        browsers : ['PhantomJS'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'test/report.app.xml',
            suite: 'unit'
        }

    });
};
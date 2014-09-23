(function () {

    'use strict';


    module.exports = function (grunt) {

        // Paths variables
        var PATHS = {
            APP: "app/",
            DIST: "dist/",
            ICONS: "icons/",
            TMP: "tmp/",
            BROWSER_EXTENSIONS: "browser-extensions/",
            FIREFOX: "firefox/",
            FIREFOX_APP: "firefox/data/",
            CHROME: "chrome/",
            CHROME_ZIP_NAME: "dbhplugin_chrome.zip"
        };

        // Load grunt tasks
        require('load-grunt-tasks')(grunt);

        grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
        grunt.loadNpmTasks('grunt-karma');
        grunt.loadNpmTasks('grunt-istanbul-coverage');
        grunt.loadNpmTasks('grunt-coveralls');
        grunt.loadNpmTasks('grunt-crx');
        grunt.loadNpmTasks('grunt-contrib-compress');
        grunt.loadNpmTasks('grunt-contrib-watch');


        // Project Configuration
        grunt.initConfig({
            concurrent: {
                dev: ['watch:scripts'],
                options: {
                    logConcurrentOutput: true
                }
            },
            watch: {
                scripts: {
                    files: ['Gruntfile.js', 'app/js/{,*/}*.js', 'test/specs/{,*/}*.js'],
                    tasks: ['jshint']
                }
            },
            jshint: {
                all: ['Gruntfile.js', 'app/js/{,*/}*.js', 'test/specs/{,*/}*.js'],
                options: {
                    reporter: require('jshint-stylish'),
                    "globals": {
                        "require": true,
                        "angular": false,
                        "afterEach": false,
                        "beforeEach": false,
                        "module": false,
                        "describe": false,
                        "expect": false,
                        "inject": false,
                        "it": false,
                        "jasmine": false,
                        "runs": false,
                        "spyOn": false,
                        "waitsFor": false,
                        "xdescribe": false
                    }
                }
            },
            copy: {
                'tmp-firefox': {
                    files: [
                        {expand: true, cwd: PATHS.ICONS, src: ['**'], dest: PATHS.TMP + PATHS.FIREFOX_APP  },
                        {expand: true, cwd: PATHS.TMP + PATHS.APP, src: ['**'], dest: PATHS.TMP + PATHS.FIREFOX_APP  },
                        {expand: true, cwd: PATHS.BROWSER_EXTENSIONS + PATHS.FIREFOX, src: ['**'], dest: PATHS.TMP + PATHS.FIREFOX  }
                    ]

                },
                'tmp-chrome': {
                    files: [
                        {expand: true, cwd: PATHS.ICONS, src: ['**'], dest: PATHS.TMP + PATHS.CHROME  },
                        {expand: true, cwd: PATHS.TMP + PATHS.APP, src: ['**'], dest: PATHS.TMP + PATHS.CHROME  },
                        {expand: true, cwd: PATHS.BROWSER_EXTENSIONS + PATHS.CHROME, src: ['**'], dest: PATHS.TMP + PATHS.CHROME  }
                    ]

                },
                'tmp-app': {
                    files: [
                        {expand: true, cwd: PATHS.APP, src: ['**', '!**/js/**', '!**/lib/**'], dest: PATHS.TMP + PATHS.APP  }
                    ]
                }
            },
            "mozilla-addon-sdk": {
                '1_17': {
                    options: {
                        revision: "1.17"
                    }
                }
            },
            "mozilla-cfx-xpi": {
                'stable': {
                    options: {
                        "mozilla-addon-sdk": "1_17",
                        extension_dir: PATHS.TMP + PATHS.FIREFOX,
                        dist_dir: PATHS.DIST + PATHS.FIREFOX
                    }
                }
            },
            crx: {
                plugin: {
                    "src": PATHS.TMP + PATHS.CHROME,
                    "dest": PATHS.DIST + PATHS.CHROME,
                    "privateKey": "./chrome.pem"
                }
            },
            compress: {
                chrome: {
                    options: {
                        archive: PATHS.DIST + PATHS.CHROME + PATHS.CHROME_ZIP_NAME
                    },
                    files: [
                        {expand: true, cwd: PATHS.TMP + PATHS.CHROME, src: ['**']} // makes all src relative to cwd
                    ]
                }
            },
            useminPrepare: {
                html: PATHS.APP + 'index.html',
                options: {
                    dest: PATHS.TMP + PATHS.APP
                }
            },
            usemin: {
                html: [PATHS.TMP + PATHS.APP + 'index.html'],
                options: {
                    dirs: [PATHS.TMP + PATHS.APP]
                }
            },
            rev: {
                dist: {
                    files: {
                        src: [
                                PATHS.TMP + PATHS.APP + 'lib/{,*/}*.js',
                                PATHS.TMP + PATHS.APP + 'js/{,*/}*.js',
                                PATHS.TMP + PATHS.APP + 'styles/{,*/}*.css'
                        ]
                    }
                }
            },
            clean: {
                'dist-chrome': [PATHS.DIST + PATHS.CHROME],
                'tmp-chrome': [PATHS.TMP + PATHS.CHROME],
                'dist-firefox': [PATHS.DIST + PATHS.FIREFOX],
                'tmp-firefox': [PATHS.TMP + PATHS.FIREFOX],
                'tmp-app': [PATHS.TMP + PATHS.APP]
            },
            karma: {
                unit: {
                    configFile: 'karma.conf.js'
                },
                'unit-ci': {
                    configFile: 'karma.conf.js',
                    singleRun: true
                }
            },
            coverage: {
                options: {
                    thresholds: {
                        'statements': 90,
                        'branches': 90,
                        'lines': 90,
                        'functions': 90
                    },
                    dir: 'coverage',
                    root: 'test'
                }
            }
        });


        // Grunt internal tasks

        grunt.registerTask('dist:firefox', 'Internal. Do not use directly', [
            'clean:dist-firefox',
            'copy:tmp-firefox',
            'mozilla-addon-sdk',
            'mozilla-cfx-xpi',
            'clean:tmp-firefox'
        ]);

        grunt.registerTask('dist:chrome', 'Internal. Do not use directly', [
            'clean:dist-chrome',
            'copy:tmp-chrome',
            //'crx:plugin'
            'compress:chrome',
            'clean:tmp-chrome'
        ]);


        // Grunt public tasks

        grunt.registerTask('build-app', 'Builds the project', [
            'clean:tmp-app',
            'useminPrepare',
            'copy:tmp-app',
            'concat',
            'uglify',
            'rev',
            'usemin'
        ]);

        grunt.registerTask('dist', 'Builds the project and prepare the package for firefox (xpi) and chrome (folder)', [
            'build-app',
            'dist:firefox',
            'dist:chrome'
        ]);

        grunt.registerTask('dev', 'dev stuff: Keeps listening for file updates to run jshint, ...TODO: open chrome, livereload, sass compilation', [
            'jshint',
            'concurrent:dev'
        ]);

        grunt.registerTask('test', 'Keeps listening for file updates to run tests', [
            'karma:unit'
        ]);

        grunt.registerTask('test-ci', 'Launches the tests and coveralls for ci', [
            'jshint',
            'karma:unit-ci'
        ]);

        grunt.registerTask('default', [
            'dev'
        ]);

    };

}());
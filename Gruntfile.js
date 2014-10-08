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
            CHROME_ZIP_NAME: "dbhplugin_chrome.zip",
            CHROME_DIST_FOLDER: "dbhplugin_chrome/",
            CHROME_CRX_FOLDER: "crx/"
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
                },
                'dist-chrome-folder': {
                    files: [
                        {expand: true, cwd: PATHS.APP, src: ['**'], dest: PATHS.DIST + PATHS.CHROME + PATHS.CHROME_DIST_FOLDER},
                        {expand: true, cwd: PATHS.ICONS, src: ['**'], dest: PATHS.DIST + PATHS.CHROME + PATHS.CHROME_DIST_FOLDER},
                        {expand: true, cwd: PATHS.BROWSER_EXTENSIONS + PATHS.CHROME, src: ['**'], dest: PATHS.DIST + PATHS.CHROME + PATHS.CHROME_DIST_FOLDER }
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
                    "dest": PATHS.DIST + PATHS.CHROME + PATHS.CHROME_CRX_FOLDER,
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
                'dist-chrome-zip': [PATHS.DIST + PATHS.CHROME + PATHS.CHROME_ZIP_NAME],
                'dist-chrome-folder': [PATHS.DIST + PATHS.CHROME + PATHS.CHROME_DIST_FOLDER],
                'dist-chrome-crx': [PATHS.DIST + PATHS.CHROME + PATHS.CHROME_CRX_FOLDER],
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

        grunt.registerTask('dist-firefox', 'Builds the project and prepare the package for firefox (xpi)', [
            'build-app',
            'clean:dist-firefox',
            'copy:tmp-firefox',
            'mozilla-addon-sdk',
            'mozilla-cfx-xpi',
            'clean:tmp-firefox'
        ]);

        grunt.registerTask('dist-chrome-zip', 'Builds the project and prepare the package for chrome (zip)', [
            'clean:dist-chrome-zip',
            'build-app',
            'copy:tmp-chrome',
            'compress:chrome',
            'clean:tmp-chrome'
        ]);

        grunt.registerTask('dist-chrome-folder', 'Builds the project and prepare the package for chrome (folder)', [
            'copy:dist-chrome-folder'
        ]);

        grunt.registerTask('dist-chrome-crx', 'Builds the project and prepare the package for chrome (crx)', [
            'clean:dist-chrome-crx',
            'build-app',
            'copy:tmp-chrome',
            'crx:plugin',
            'clean:tmp-chrome'
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
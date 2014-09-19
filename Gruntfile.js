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
        CHROME: "chrome/"
    };

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
    grunt.loadNpmTasks('grunt-karma');


    // Project Configuration
    grunt.initConfig({
        copy: {
            'tmp-firefox': {
                files: [
                    {expand: true, cwd: PATHS.ICONS, src: ['**'], dest: PATHS.TMP + PATHS.FIREFOX_APP  },
                    {expand: true, cwd: PATHS.TMP + PATHS.APP, src: ['**'], dest: PATHS.TMP + PATHS.FIREFOX_APP  },
                    {expand: true, cwd: PATHS.BROWSER_EXTENSIONS + PATHS.FIREFOX, src: ['**'], dest: PATHS.TMP + PATHS.FIREFOX  }
                ]

            },
            'dist-chrome': {
                files: [
                    {expand: true, cwd: PATHS.ICONS, src: ['**'], dest: PATHS.DIST + PATHS.CHROME  },
                    {expand: true, cwd: PATHS.TMP + PATHS.APP, src: ['**'], dest: PATHS.DIST + PATHS.CHROME  },
                    {expand: true, cwd: PATHS.BROWSER_EXTENSIONS + PATHS.CHROME, src: ['**'], dest: PATHS.DIST + PATHS.CHROME  }
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
        }
    });


    // Grunt internal tasks

    grunt.registerTask('dist:firefox', 'Internal. Do not use directly', [
        'clean:tmp-firefox',
        'copy:tmp-firefox',
        'mozilla-addon-sdk',
        'mozilla-cfx-xpi'
    ]);

    grunt.registerTask('dist:chrome', 'Internal. Do not use directly', [
        'clean:dist-chrome',
        'copy:dist-chrome'
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

    grunt.registerTask('test', 'Keeps listening for file updates for running the tests', [
        'karma:unit'
    ]);

    grunt.registerTask('test-ci', 'Launches the tests', [
        'karma:unit-ci'
    ]);

};
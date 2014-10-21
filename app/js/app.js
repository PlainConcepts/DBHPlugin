(function () {

    'use strict';

    var plugin = angular.module('DBHPluginApp', []);

    plugin.config(function ($logProvider) {
        $logProvider.debugEnabled(true);
    });

}());
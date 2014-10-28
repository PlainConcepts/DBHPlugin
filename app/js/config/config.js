(function () {
    'use strict';

    var config = {
        apiBaseUrl: 'http://localhost:3000/api/'
    };

    var plugin = angular.module('DBHPluginApp');
    plugin.constant('config', config);

    plugin.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(true);
    }]);

    plugin.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }]);

}());

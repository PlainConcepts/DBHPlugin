(function () {
    'use strict';

    var config = {
        apiBaseUrl: 'http://browserhistory.azurewebsites.net/api/'
    };

    var plugin = angular.module('DBHPluginApp');
    plugin.constant('config', config);

    plugin.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(false);
    }]);

    plugin.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }]);

}());

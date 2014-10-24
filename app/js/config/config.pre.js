(function () {
    'use strict';

    var config = {
        apiBaseUrl: 'http://dbhapi-test.azurewebsites.net/api/'
    };

    angular
        .module('DBHPluginApp')
        .constant('config', config);

}());

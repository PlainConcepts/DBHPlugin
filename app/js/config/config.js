(function () {
    'use strict';

    var config = {
        apiBaseUrl: 'http://localhost:3000/api/'
    };

    angular
        .module('DBHPluginApp')
        .constant('config', config);

}());

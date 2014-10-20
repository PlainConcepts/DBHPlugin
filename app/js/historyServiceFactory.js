(function () {
    'use strict';

    function historyServiceFactory($window, chromeHistoryService, firefoxHistoryService) {
        function browserIsChrome() {
            return typeof $window.chrome !== 'undefined';
        }

        function browserIsFirefox() {
            return typeof $window.prefManager !== 'undefined';
        }

        if (browserIsChrome()) {
            return chromeHistoryService;
        }
        else if (browserIsFirefox()) {
            return firefoxHistoryService;
        }
    }

    historyServiceFactory.$inject = ['$window', 'chromeHistoryService', 'firefoxHistoryService'];

    angular
        .module('DBHPluginApp')
        .factory('historyServiceFactory', historyServiceFactory);
})();
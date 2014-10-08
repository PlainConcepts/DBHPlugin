(function () {
    'use strict';

    angular
        .module('DBHPluginApp')
        .factory('HistoryServiceFactory', ['$q', 'ChromeHistoryService', function ($q, chromeHistoryService) {
            function browserIsChrome() {
                return true;
            }

            function browserIsFirefox() {
                return false;
            }

            //TODO: Implement2
            var firefoxHistoryService = {};

            if (browserIsChrome()) {
                return chromeHistoryService;
            }
            else if (browserIsFirefox()) {
                return firefoxHistoryService;
            }

        }]);
})();
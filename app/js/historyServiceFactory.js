(function () {
    'use strict';

    angular
        .module('DBHPluginApp')
        .factory('HistoryServiceFactory', ['$q', 'ChromeHistoryService', function ($q, chromeHistoryService) {
            if (browserIsChrome()) {
                return chromeHistoryService;
            }
            else if (browserIsFirefox()) {
                return firefoxHistoryService;
            }

            function browserIsChrome() {
                return true;
            }

            function browserIsFirefox() {
                return false;
            }
        }]);
})();
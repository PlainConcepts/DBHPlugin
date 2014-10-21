(function () {
    'use strict';

    function historyFetcher($window, chromeHistoryFetcher, firefoxHistoryFetcher) {

        function browserIsChrome() {
            return typeof $window.chrome !== 'undefined';
        }

        function browserIsFirefox() {
            return typeof $window.prefManager !== 'undefined';
        }

        if (browserIsChrome()) {
            return chromeHistoryFetcher;
        }
        else if (browserIsFirefox()) {
            return firefoxHistoryFetcher;
        }
    }

    historyFetcher.$inject = ['$window', 'chromeHistoryFetcher', 'firefoxHistoryFetcher'];

    angular
        .module('DBHPluginApp')
        .factory('historyFetcher', historyFetcher);
})();
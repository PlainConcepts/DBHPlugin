(function () {
    'use strict';

    function chromeHistoryFetcher($q, $window) {

        var chrome = $window.chrome;

        var getHistory = function () {
            var deferred = $q.defer();

            if (chrome && chrome.history) {
                var query;
                query = {
                    text: '',
                    startTime: 0,
                    endTime: (new Date()).getTime(),
                    maxResults: 2147483647
                };

                chrome.history.search(query, function (results) {
                    deferred.resolve(results);
                });
            }
            else {
                deferred.reject('chrome.history not available');
            }

            return deferred.promise;
        };

        return {
            getHistory: getHistory
        };

    }

    chromeHistoryFetcher.$inject = ['$q', '$window'];

    angular
        .module('DBHPluginApp')
        .factory('chromeHistoryFetcher', chromeHistoryFetcher);

}());
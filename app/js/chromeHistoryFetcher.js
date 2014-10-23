(function () {
    'use strict';

    function chromeHistoryFetcher($q, $window) {

        var chrome = $window.chrome;

        function getHistory(startTime, endTime) {
            var deferred = $q.defer();

            if (chrome && chrome.history) {
                var query = {
                    text: '',
                    startTime: startTime.valueOf(),
                    endTime: endTime.valueOf(),
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
        }

        function getVisits(url, title) {
            var deferred = $q.defer();

            var query = {'url': url};

            if (chrome && chrome.history) {
                chrome.history.getVisits(query, function (visitItems) {
                        deferred.resolve(visitItems.map(function (item) {
                            return {time: item.visitTime, title: title, url: url};
                        }));
                    }
                );
            }
            else {
                deferred.reject('chrome.history not available');
            }

            return deferred.promise;
        }

        return {
            getHistory: getHistory,
            getVisits: getVisits
        };

    }

    chromeHistoryFetcher.$inject = ['$q', '$window'];

    angular
        .module('DBHPluginApp')
        .factory('chromeHistoryFetcher', chromeHistoryFetcher);

}());
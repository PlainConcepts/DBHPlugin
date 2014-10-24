(function () {
    'use strict';

    function chromeHistoryFetcher($q, $log, $window) {

        var chrome = $window.chrome,
            maxIntValue = 2147483647;

        function getHistory(startTime, endTime) {
            var deferred = $q.defer();
            $log.debug('[chromeHistoryFetcher]: start getting history');

            if (chrome && chrome.history) {
                var query = {
                    text: '',
                    startTime: startTime.valueOf(),
                    endTime: endTime.valueOf(),
                    maxResults: maxIntValue
                };

                chrome.history.search(query, function (results) {
                    $log.debug('[chromeHistoryFetcher]: got history! count: ' + results.length);
                    deferred.resolve(results);
                });
            }
            else {
                deferred.reject('[chromeHistoryFetcher]:  chrome.history not available');
            }

            return deferred.promise;
        }

        function getVisits(url, title, startTime, endTime) {
            var deferred = $q.defer();

            var query = {'url': url};

            if (chrome && chrome.history) {
                chrome.history.getVisits(query, function (visitItems) {
                        var filteredByWindowTime = visitItems.filter(function(item){
                            return item.visitTime >= startTime && item.visitTime <= endTime;
                        });
                        deferred.resolve(filteredByWindowTime.map(function (item) {
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

    chromeHistoryFetcher.$inject = ['$q', '$log', '$window'];

    angular
        .module('DBHPluginApp')
        .factory('chromeHistoryFetcher', chromeHistoryFetcher);

}());
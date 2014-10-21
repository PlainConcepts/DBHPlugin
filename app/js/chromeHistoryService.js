(function () {
    'use strict';

    function chromeHistoryService($q, $window) {

        var chrome = $window.chrome;

        var getFilteredHistory = function () {
            var deferred = $q.defer();

            if (chrome && chrome.history) {
                var query;
                query = {
                    text: '',
                    startTime: 0,
                    endTime: (new Date()).getTime()
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
            getFilteredHistory: getFilteredHistory
        };

    }

    chromeHistoryService.$inject = ['$q', '$window'];

    angular
        .module('DBHPluginApp')
        .factory('chromeHistoryService', chromeHistoryService);

}());
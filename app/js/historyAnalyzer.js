(function () {
    'use strict';

    function historyAnalyzer($q, historyFetcher) {

        function getFilteredHistory(/*urlsToMatch*/) {
            var deferred = $q.defer();
            // Build regex cache
            // Read browser history
            historyFetcher.getHistory();
            // Filter browser history against regex cache
            // return filtered urls
            deferred.resolve([]);
            return deferred.promise;
        }

        return {
            getFilteredHistory: getFilteredHistory
        };
    }

    historyAnalyzer.$inject = ['$q', 'historyFetcher'];

    angular
        .module('DBHPluginApp')
        .factory('historyAnalyzer', historyAnalyzer);
})();
(function () {
    'use strict';

    function firefoxHistoryFetcher($q) {

        function getHistory(/*startTime, endTime*/) {
            var deferred = $q.defer();
            deferred.resolve(['test']);
            return deferred.promise;
        }

        function getVisits(/*url, title*/) {
            var deferred = $q.defer();
            deferred.resolve(['test']);
            return deferred.promise;
        }

        return {
            getHistory: getHistory,
            getVisits: getVisits
        };

    }

    firefoxHistoryFetcher.$inject = ['$q'];

    angular
        .module('DBHPluginApp')
        .factory('firefoxHistoryFetcher', firefoxHistoryFetcher);

}());
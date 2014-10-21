(function () {
    'use strict';

    function firefoxHistoryFetcher($q) {

        var getHistory = function () {
            var deferred = $q.defer();
            deferred.resolve(['test']);
            return deferred.promise;
        };

        return {
            getHistory: getHistory
        };

    }

    firefoxHistoryFetcher.$inject = ['$q'];

    angular
        .module('DBHPluginApp')
        .factory('firefoxHistoryFetcher', firefoxHistoryFetcher);

}());
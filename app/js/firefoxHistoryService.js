(function () {
    'use strict';

    function firefoxHistoryService($q) {

        var getFilteredHistory = function () {
            var deferred = $q.defer();
            deferred.resolve(['test']);
            return deferred.promise;
        };

        return {
            getFilteredHistory: getFilteredHistory
        };

    }

    firefoxHistoryService.$inject = ['$q'];

    angular
        .module('DBHPluginApp')
        .factory('firefoxHistoryService', firefoxHistoryService);

}());
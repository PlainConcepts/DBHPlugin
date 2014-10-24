(function () {
    'use strict';

    function dbhDataContext($q, $http, $log, config) {

        var baseUrl = config.apiBaseUrl || '';

        function getApiSiteCatalog() {
            var deferred = $q.defer();

            $http.get(baseUrl + 'urls')
                .success(function (data) {
                    $log.debug('[dbhDataContext]: siteCatalog fetched from dbh api');
                    deferred.resolve(data);
                })
                .error(function (data) {
                    $log.error('[dbhDataContext]: error fetching match urls from dbh api. ' + data ? data : '');
                    deferred.reject();
                });

            return deferred.promise;
        }

        return {
            getApiSiteCatalog: getApiSiteCatalog
        };
    }

    dbhDataContext.$inject = ['$q', '$http', '$log', 'config'];

    angular
        .module('DBHPluginApp')
        .factory('dbhDataContext', dbhDataContext);
})();
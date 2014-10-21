(function () {
    'use strict';

    function dbhDataContext($q, $http, $log, config) {

        var baseUrl = config.apiBaseUrl || '';

        function getUrls() {
            var deferred = $q.defer();

            $http.get(baseUrl + 'urls')
                .success(function(data){
                    $log.debug('match urls fetched from dbh api');
                    deferred.resolve(data);
                })
                .error(function(data){
                    $log.error('error fetching match urls from dbh api');
                    console.log(data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        return {
            getUrls: getUrls
        };
    }

    dbhDataContext.$inject = ['$q', '$http', '$log', 'config'];

    angular
        .module('DBHPluginApp')
        .factory('dbhDataContext', dbhDataContext);
})();
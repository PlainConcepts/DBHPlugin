(function () {
    'use strict';

    function HistoryController($scope, dbhDataContext, historyAnalyzer, moment) {

        $scope.filteredUrls = [];

        $scope.sendFilteredHistory = function () {

        };

        dbhDataContext.getApiSiteCatalog().then(
            function success(apiSiteCatalog) {
                historyAnalyzer.getDeveloperResources(apiSiteCatalog, moment().subtract(5, 'days'), moment())
                    .then(function (filteredUrls) {
                        $scope.filteredUrls = filteredUrls;
                    });
            }
        );
    }

    HistoryController.$inject = ['$scope', 'dbhDataContext', 'historyAnalyzer', 'moment'];

    angular.module('DBHPluginApp')
        .controller('HistoryController', HistoryController);

}());
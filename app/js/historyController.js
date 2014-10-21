(function () {
    'use strict';

    function HistoryController($scope, dbhDataContext, historyServiceFactory) {

        $scope.filteredUrls = [];

        dbhDataContext.getUrls().then(
            function (data) {
                historyServiceFactory.getFilteredHistory(data)
                    .then(function (filteredUrls) {
                        $scope.filteredUrls = filteredUrls;
                    });
            }
        );
    }

    HistoryController.$inject = ['$scope', 'dbhDataContext', 'historyServiceFactory'];

    angular.module('DBHPluginApp')
        .controller('HistoryController', HistoryController);

}());
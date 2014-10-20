(function () {
    'use strict';

    function HistoryController($scope, historyServiceFactory) {
        $scope.filteredUrls = [];
        historyServiceFactory.getFilteredHistory()
            .then(function (filteredUrls) {
                $scope.filteredUrls = filteredUrls;
            });
    }

    HistoryController.$inject = ['$scope', 'historyServiceFactory'];

    angular.module('DBHPluginApp')
        .controller('HistoryController', HistoryController);

}());
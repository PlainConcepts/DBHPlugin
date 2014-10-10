(function () {
    'use strict';

    angular.module('DBHPluginApp')
        .controller('HistoryController', ['$scope', 'HistoryServiceFactory', function ($scope, historyServiceFactory) {
            $scope.filteredUrls = [];
            historyServiceFactory.getFilteredHistory()
                .then(function (filteredUrls) {
                    $scope.filteredUrls = filteredUrls;
                });
        }]);
}());
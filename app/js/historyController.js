(function () {
    'use strict';

    angular.module('DBHPluginApp')
        .controller('HistoryController', ['$scope', 'HistoryServiceFactory', function ($scope, historyServiceFactory) {
            historyServiceFactory.getFilteredHistory()
                .then(function (filteredUrls) {
                    $scope.filteredUrls = filteredUrls;
                });

        }]);
}());
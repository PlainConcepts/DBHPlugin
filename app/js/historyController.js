(function () {
    'use strict';

    function HistoryController($scope, dbhDataContext, historyAnalyzer) {

        $scope.filteredUrls = [];

        $scope.sendFilteredHistory = function () {

        };

        dbhDataContext.getUrlsToMatch().then(
            function success(urlsToMatch) {
                historyAnalyzer.getFilteredHistory(urlsToMatch)
                    .then(function (filteredUrls) {
                        $scope.filteredUrls = filteredUrls;
                    });
            }
        );
    }

    HistoryController.$inject = ['$scope', 'dbhDataContext', 'historyAnalyzer'];

    angular.module('DBHPluginApp')
        .controller('HistoryController', HistoryController);

}());
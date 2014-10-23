(function () {
    'use strict';

    function HistoryController($scope, dbhDataContext, historyAnalyzer, moment) {

        $scope.filteredUrls = [];

        $scope.sendFilteredHistory = function () {

        };

        dbhDataContext.getUrlsToMatch().then(
            function success(urlsToMatch) {
                historyAnalyzer.getDeveloperResources(urlsToMatch, moment().subtract(5, 'days'), moment())
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
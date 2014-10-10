﻿
(function () {
    'use strict';

    angular
        .module('DBHPluginApp')
        .service('ChromeHistoryService', ['$q', function ($q) {

            var getFilteredHistory = function () {
                var deferred = $q.defer();

                if (chrome.history) {
                    var query;
                    query = {
                        text: '',
                        startTime: 0,
                        endTime: (new Date()).getTime()
                    };

                    chrome.history.search(query, function (results) {
                        deferred.resolve(results);
                    });
                }
                else {
                    deferred.reject('chrome.history not available');
                }

                return deferred.promise;
            };


            return {
                getFilteredHistory: getFilteredHistory
            };

    }]);

}());
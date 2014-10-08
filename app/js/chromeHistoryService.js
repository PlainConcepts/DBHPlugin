(function () {

    angular
        .module('DBHPluginApp')
        .service('ChromeHistoryService', ['$q', function ($q) {

            var ChromeHistory = (function () {

                var getFilteredHistory = function () {

                    var deferred = $q.defer();

                    if (chrome.history) {
                        var now = new Date().getTime(),
                            query = {
                                text: '',
                                startTime: 0,
                                endTime: now
                            };

                        chrome.history.search(query, function (results) {
                            console.log(results);
                            deferred.resolve(results);
                        });
                    }
                    else {
                        deferred.reject('chrome.history not available2');
                    }

                    return deferred.promise;
                };


                return {
                    getFilteredHistory: getFilteredHistory
                };

            }());

            return ChromeHistory;

        }]);

}());
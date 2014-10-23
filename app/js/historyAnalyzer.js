(function () {
    'use strict';

    function historyAnalyzer($q, moment, historyFetcher, developerResourcesHistoryFinder) {

        var thresholdInHours = 60 * 60 * 0.5;

        function buildVisit(title, url, siteType, time, spacer, needsDateHeader) {
            return {
                title: title,
                url: url,
                classKind: siteType,
                spacer: spacer,
                needsDateHeader: needsDateHeader,
                friendlyTime: moment(time).format('LT'),
                friendlyDate: moment(time).format('dddd, MMMM D YYYY')
            };
        }

        function buildVisits(developerResources) {
            var visits = [],
                last;

            if (developerResources.length === 0) {
                return visits;
            }

            last = developerResources[0].time;

            angular.forEach(developerResources, function (item) {
                    var deltaInSeconds = Math.abs(item.time.valueOf() - last.valueOf()) / 1000;
                    var spacer = false;
                    var needsDateHeader = false;

                    if (moment(last).format('L') !== moment(item.time).format('L')) {
                        needsDateHeader = true;
                    }
                    // chained so that date Header and spacer don't both appear.
                    else if (deltaInSeconds > thresholdInHours) {
                        spacer = true;
                    }
                    visits.push(buildVisit(item.title, item.url, item.siteType, item.time, spacer, needsDateHeader));
                    last = item.time;
                }
            );

            visits[0].needsDateHeader = true;

            return visits;
        }

        function getDeveloperResources(urlsToMatch, startTime, endTime) {
            var deferred = $q.defer();

            // Read browser history for specified dates
            historyFetcher.getHistory(startTime, endTime).then(
                function success(rawHistory) {
                    // Find developer resources in raw history
                    developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                        function success(developerResources) {
                            // return visits from developer resources
                            deferred.resolve(buildVisits(developerResources));
                        }
                    );
                }
            );

            return deferred.promise;
        }

        return {
            getDeveloperResources: getDeveloperResources
        };
    }

    historyAnalyzer.$inject = ['$q', 'moment', 'historyFetcher', 'developerResourcesHistoryFinder'];

    angular
        .module('DBHPluginApp')
        .factory('historyAnalyzer', historyAnalyzer);
})();
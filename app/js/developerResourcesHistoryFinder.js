(function () {
    'use strict';

    function developerResourcesHistoryFinder($q, $log, moment, historyFetcher, urlAnalyzer, regexUtils) {

        var siteCatalog,
            regexCache = [];

        function buildRexExCache(apiSiteCatalog) {
            $log.debug('[developerResourcesHistoryFinder]: start building regexCache');
            var cacheIsAlreadyBuilt = 0 < regexCache.length;
            if (cacheIsAlreadyBuilt) {
                $log.debug('[developerResourcesHistoryFinder]: regexCache built. Not build required');
                return;
            }

            siteCatalog = apiSiteCatalog;
            for (var i = 0; i < apiSiteCatalog.length; i++) {
                var site = apiSiteCatalog[i];
                for (var u = 0; u < site.urls.length; u++) {
                    var pattern = site.urls[u];
                    regexCache[pattern] = {
                     site: site.name,
                     ico: site.ico,
                     pattern: regexUtils.convert2RegExp(pattern)
                    };
                }
            }
            $log.debug('[developerResourcesHistoryFinder]: regexCache built!');
        }

        function meetsRequirements(visitItem){
            return visitItem.isDevelopmentSite || visitItem.isGoogleSearch;
        }

        function includeSiteInfo(visitItem) {
            if(visitItem.isGoogleSearch){
                visitItem.isDevelopmentSite = false;
                visitItem.siteName = 'google';
                visitItem.ico = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAANKSURBVDhPLZN/TJR1HMc/z/NgS0YCf9jW1GKtzCzW2iwOTiJ1sWA1baZGm7pl+U/2469+2NUSPApLxTAS7Iexdom5Agr0ZmGlFjkG6sIKkl9ZkncCd7DT87l7Xn2ex57tfd/vfe/ePz7vfR9BHzsF3QOj5K0PkfHIp1QfPE2aFMnYBMdKiugzhKumSVpEYZLQ7+O6dx9J2eDoZkXVYWRNGHNDN7Oe+pY//4nrDykSv/ZxISvTIzuGRVrJrkBUMhg2hWsJbJvbNnUgG7qQjb1IxQ9UfXXGU1YNhktLSYpByhKShsGkWERUZEhFxUmrgv7JH+jEXPsT5sYuzCePs2ZHjyvt6nNu5Qqm1RElpZU8pevfSu43LTeBq5CmsvkMsjJMxtMnMZ/4joraLj3VCFfg5zsX8ONN19E6P5eOvFy6c2YwovHdbmRg5JLXwVgswYJN7cjjR5i1Nky497x33tC6l3kv5iHvF2DVFyN1fmbW3E/RM/lsuysbuWPdJxzsPKshHCbiSfYdHaR/9JLnHjzcgFTejdXox9pThNQXKAoxdum+rgTjraXI7NX7yVn+IUtfCLG1qfNaazr70f5fMF++Bdl7H9KgxMYCjN2LPchOH8Y7xSrwgCaoaGLuqs+4vvxjch/ew9BYDMdxGImeZ37jY8jufMwPChV+3fsw3/Nj7CzGVAGp8SG3lu3At+4jVr/RxvO139PbP+7Fd/QzEo9Quv9ZjO35Gl2ddX4PKiDbFFsVoSOniIx7fXN1so+xcy0M9tZzeeqinuiZ3rSy0HMqslDJ6ljrV/dC5G0VDCrUiKl/T9HT4mOoJZO/2oXRL03ONi8kFv3D6+S3sWFuqC5RciHWu4sxa9Q5qPNvUVyxp+kOFTDxjV7VEyb2sUwSnTO5eEAYaCn3+nB7vX3XKp15EbJdR6guZsaWZRivq0A8OsjvTXO4HM4hFs4i3p7NZFs201/P4cIX90ByioTtMC9YrkQtM7hEV03x5oPIa5rETjkMHVpP9PMsJltvJNY22yPHDtzM+PGA103zyUNYL92LUaX3oVJHcZ03K15d9v/LNB0lciLARMdyYq0P6fooiZ46knaC0yODzH2lTAmLMANKDrjOWt7mJcqE/wC5n5ZqBQEA6gAAAABJRU5ErkJggg==";
                return visitItem;
            }

            // included in site catalog
            for (var matcher in regexCache) {
                if(!regexCache.hasOwnProperty(matcher)){
                    continue;
                }

                var siteMatcher = regexCache[matcher];
                if (visitItem.url.match(siteMatcher.pattern)) {
                    visitItem.isDevelopmentSite = true;
                    visitItem.siteName = siteMatcher.site;
                    visitItem.ico = siteMatcher.ico;
                    return visitItem;
                }
            }

            visitItem.isDevelopmentSite = false;
            return visitItem;
        }

        function filterAdjacent(visits) {

            if (visits.length < 2) {
                return visits;
            }

            var included = [];
            included.push(visits[0]);

            for (var i = 1; i < visits.length; i++) {
                var previous = visits[i - 1];
                var current = visits[i];

                if (previous.url === current.url) {
                    continue;
                }
                else if (previous.isGoogleSearch && previous.title === current.title) {
                    continue;
                }
                else {
                    included.push(current);
                }
            }

            return included;
        }

        function getLocalTime(googleTime) {
            return moment(parseInt(googleTime, 10));
        }

        function compareVisitTimesInSeconds(a, b) {
            return ( getLocalTime(a).valueOf() - getLocalTime(b).valueOf()) / 1000;
        }

        function filterGoogleSearchNearSite(secondsThreshold, visits) {
            var included = [];

            for (var i = 0; i < visits.length; i++) {
                var visit = visits[i];
                if (visit.isGoogleSearch) {
                    var searchTime = visit.time;
                    var docTime = visits[visits.length - 1].time + 100000;
                    for (var x = i + 1; x < visits.length; x++) {
                        var d = visits[x];
                        if (!d.isGoogleSearch) {
                            docTime = d.time;
                            break;
                        }
                    }

                    var differenceInSeconds = compareVisitTimesInSeconds(docTime, searchTime);
                    if (differenceInSeconds < secondsThreshold) {
                        included.push(visit);
                    }
                }
                else {
                    included.push(visit);
                }
            }
            return included;
        }

        function finder(rawHistory, startTime, endTime) {
            var deferred = $q.defer();
            var promises = [];

            angular.forEach(rawHistory, function (historyItem) {
                if (historyItem.url) {
                    promises.push(historyFetcher.getVisits(historyItem.url, historyItem.title, startTime, endTime));
                }
            });

            $q.all(promises).then(
                function (results) {
                    var filteredHistory = [];
                    var visitCount = 0;

                    angular.forEach(results, function (historyUrlVisits) {
                        visitCount += historyUrlVisits.length;
                        var last = null;

                        angular.forEach(historyUrlVisits, function (visitItem) {
                            // Often, multiple requests are made, resulting in duplicate visits -- only include first in sequential visits.
                            if (!last || (last.title !== visitItem.title && last.url !== visitItem.url)) {
                                // Google search often includes redirects, which sets title of site to be visited next.  Replace with query.
                                if (urlAnalyzer.isGoogleSearch(visitItem.url)) {
                                    var params = urlAnalyzer.getUrlParameters(visitItem.url);
                                    if (params.q) {
                                        visitItem.title = decodeURIComponent(params.q.replace(/\+/g, ' '));
                                    }
                                }
                                //visitItem.isGoogleRedirect = urlAnalyzer.isGoogleRedirect(visitItem.url);
                                visitItem.isGoogleSearch = urlAnalyzer.isGoogleSearch(visitItem.url);

                                filteredHistory.push(visitItem);
                            }
                            last = visitItem;
                        });
                    });

                    filteredHistory.sort(function (a, b) {
                        return a.time - b.time;
                    });

                    deferred.resolve(filteredHistory);
                }
            );

            return deferred.promise;
        }

        function process(apiSiteCatalog, startTime, endTime) {
            var deferred = $q.defer();

            // Build regex cache
            if (apiSiteCatalog && apiSiteCatalog.length > 0) {
                buildRexExCache(apiSiteCatalog);
            } else {
                deferred.reject('no site catalog to work with!');
            }

            // Do find
            historyFetcher.getHistory(startTime, endTime).then(
                function success(rawHistory) {
                    $log.debug('[developerResourcesHistoryFinder]:  start finding developer resources in raw history');
                    finder(rawHistory, startTime, endTime).then(
                        function success(candidates) {
                            $log.debug('[developerResourcesHistoryFinder]:  got developer resources candidates. count: ' + candidates.length);

                            var filtered = candidates
                                            .map(includeSiteInfo)
                                            .filter(meetsRequirements);

                            $log.debug('[developerResourcesHistoryFinder]:  mustInclude filter. count: ' + filtered.length);

                            filtered = filterAdjacent(filtered);
                            $log.debug('[developerResourcesHistoryFinder]:  filter adjacent visits. count: ' + filtered.length);

                            var nearSearchTimeRange = 30;
                            filtered = filterGoogleSearchNearSite(nearSearchTimeRange, filtered);
                            $log.debug('[developerResourcesHistoryFinder]:  filter developer resource near search. count ' + filtered.length);
                            $log.debug('[developerResourcesHistoryFinder]:  process done!');

                            deferred.resolve(filtered);
                        }
                    );
                }
            );

            return deferred.promise;
        }

        return {
            process: process
        };
    }

    developerResourcesHistoryFinder.$inject = ['$q', '$log', 'moment', 'historyFetcher', 'urlAnalyzer', 'regexUtils'];

    angular
        .module('DBHPluginApp')
        .factory('developerResourcesHistoryFinder', developerResourcesHistoryFinder);
})();
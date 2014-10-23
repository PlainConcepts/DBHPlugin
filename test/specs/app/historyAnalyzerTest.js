/* jshint camelcase: false */

describe('historyAnalyzer Test', function () {

    'use strict';

    var historyFetcherMock,
        developerResourcesHistoryFinderMock,
        $q,
        $timeout,
        historyAnalyzer;

    beforeEach(function () {
        historyFetcherMock = jasmine.createSpyObj('historyFetcher', ['getHistory']);
        developerResourcesHistoryFinderMock = jasmine.createSpyObj('developerResourcesHistoryFinder', ['process']);

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('historyFetcher', historyFetcherMock);
            $provide.value('developerResourcesHistoryFinder', developerResourcesHistoryFinderMock);
        });
    });

    beforeEach(inject(function (_$q_, _$timeout_, _historyAnalyzer_) {
        $q = _$q_;
        $timeout = _$timeout_;
        historyAnalyzer = _historyAnalyzer_;
    }));

    describe('getDeveloperResources', function () {

        var developerResources;

        beforeEach(function () {
            historyFetcherMock.getHistory.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve([]);
                return deferred.promise;
            });
            developerResourcesHistoryFinderMock.process.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(developerResources);
                return deferred.promise;
            });
        });

        it('returns empty array if no history', function (done) {
            developerResources = [];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual([]);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('returns only one visit ok', function (done) {
            developerResources = [
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413735836683.803}
            ];
            var expectedVisits = [
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: false, needsDateHeader: true, friendlyTime:'6:23 PM', friendlyDate: 'Sunday, October 19 2014'}
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('return two visits in same day under separator threshold does not have separator', function (done) {
            developerResources = [
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413735836683.803},
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413735846683.803}
            ];
            var expectedVisits = [
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: false, needsDateHeader: true, friendlyTime:'6:23 PM', friendlyDate: 'Sunday, October 19 2014'},
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: false, needsDateHeader: false, friendlyTime:'6:24 PM', friendlyDate: 'Sunday, October 19 2014'}
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('return two visits in same day over separator threshold must have separator', function (done) {
            developerResources = [
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413735836683.803},
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413737836683.803}
            ];
            var expectedVisits = [
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: false, needsDateHeader: true, friendlyTime:'6:23 PM', friendlyDate: 'Sunday, October 19 2014'},
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: true, needsDateHeader: false, friendlyTime:'6:57 PM', friendlyDate: 'Sunday, October 19 2014'}
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('return two visits in different day does not have separators and have both header', function (done) {
            developerResources = [
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413735836683.803},
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: 1413835836683.803}
            ];
            var expectedVisits = [
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: false, needsDateHeader: true, friendlyTime:'6:23 PM', friendlyDate: 'Sunday, October 19 2014'},
                {title: 'AngularJS', url: 'https://docs.angularjs.org/api', classKind: 'test', spacer: false, needsDateHeader: true, friendlyTime:'10:10 PM', friendlyDate: 'Monday, October 20 2014'}
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });
    });

});
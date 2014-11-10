/* jshint camelcase: false */

describe('historyAnalyzer Test', function () {

    'use strict';
    function getFriendlyTime(time) {
        return moment(time).format('LT');
    }

    function getFriendlyDate(time) {
        return moment(time).format('dddd, MMMM D YYYY');
    }

    var developerResourcesHistoryFinderMock,
        $q,
        $timeout,
        moment,
        historyAnalyzer;

    beforeEach(function () {
        developerResourcesHistoryFinderMock = jasmine.createSpyObj('developerResourcesHistoryFinder', ['process']);

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('developerResourcesHistoryFinder', developerResourcesHistoryFinderMock);
        });
    });

    beforeEach(inject(function (_$q_, _$timeout_, _moment_, _historyAnalyzer_) {
        $q = _$q_;
        $timeout = _$timeout_;
        moment = _moment_;
        historyAnalyzer = _historyAnalyzer_;
    }));

    describe('getDeveloperResources', function () {

        var developerResources;

        beforeEach(function () {
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

        xit('returns only one visit ok', function (done) {
            var time = moment().toDate().valueOf();
            developerResources = [
                {
                    url: 'https://docs.angularjs.org/api',
                    title: 'AngularJS',
                    siteType: 'test',
                    time: time
                }
            ];
            var expectedVisits = [
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: false,
                    needsDateHeader: true,
                    friendlyTime: getFriendlyTime(time),
                    friendlyDate: getFriendlyDate(time)
                }
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        xit('return two visits in same day under separator threshold does not have separator', function (done) {
            var time1 = moment().toDate().valueOf(),
                time2 = moment().subtract(5, 'minutes').toDate().valueOf();
            developerResources = [
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: time1},
                {url: 'https://docs.angularjs.org/api', title: 'AngularJS', siteType: 'test', time: time2}
            ];
            var expectedVisits = [
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: false,
                    needsDateHeader: true,
                    friendlyTime: getFriendlyTime(time1),
                    friendlyDate: getFriendlyDate(time1)
                },
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: false,
                    needsDateHeader: false,
                    friendlyTime: getFriendlyTime(time2),
                    friendlyDate: getFriendlyDate(time2)
                }
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        xit('return two visits in same day over separator threshold must have separator', function (done) {
            var time1 = moment().toDate().valueOf(),
                time2 = moment().subtract(35, 'minutes').toDate().valueOf();
            developerResources = [
                {
                    url: 'https://docs.angularjs.org/api',
                    title: 'AngularJS',
                    siteType: 'test',
                    time: time1
                },
                {
                    url: 'https://docs.angularjs.org/api',
                    title: 'AngularJS',
                    siteType: 'test',
                    time: time2
                }
            ];
            var expectedVisits = [
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: false,
                    needsDateHeader: true,
                    friendlyTime: getFriendlyTime(time1),
                    friendlyDate: getFriendlyDate(time1)
                },
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: true,
                    needsDateHeader: false,
                    friendlyTime: getFriendlyTime(time2),
                    friendlyDate: getFriendlyDate(time2)
                }
            ];

            historyAnalyzer.getDeveloperResources().then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        xit('return two visits in different day does not have separators and have both header', function (done) {
            var time1 = moment().toDate().valueOf(),
                time2 = moment().subtract(1, 'day').toDate().valueOf();
            developerResources = [
                {
                    url: 'https://docs.angularjs.org/api',
                    title: 'AngularJS',
                    siteType: 'test',
                    time: time1
                },
                {
                    url: 'https://docs.angularjs.org/api',
                    title: 'AngularJS',
                    siteType: 'test',
                    time: time2
                }
            ];
            var expectedVisits = [
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: false,
                    needsDateHeader: true,
                    friendlyTime: getFriendlyTime(time1),
                    friendlyDate: getFriendlyDate(time1)
                },
                {
                    title: 'AngularJS',
                    url: 'https://docs.angularjs.org/api',
                    classKind: 'test',
                    spacer: false,
                    needsDateHeader: true,
                    friendlyTime: getFriendlyTime(time2),
                    friendlyDate: getFriendlyDate(time2)
                }
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
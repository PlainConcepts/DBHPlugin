/* jshint camelcase: false */

describe('developerResourcesHistoryFinder Test', function () {

    'use strict';

    var historyFetcherMock,
        $q,
        $timeout,
        moment,
        developerResourcesHistoryFinder;

    beforeEach(function () {
        historyFetcherMock = jasmine.createSpyObj('historyFetcher', ['getVisits']);

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('historyFetcher', historyFetcherMock);
        });
    });

    beforeEach(inject(function (_$q_, _$timeout_, _moment_,_developerResourcesHistoryFinder_) {
        $q = _$q_;
        $timeout = _$timeout_;
        moment = _moment_;
        developerResourcesHistoryFinder = _developerResourcesHistoryFinder_;
    }));

    describe('process', function () {

        var rawHistory,
            visitsToUrl,
            urlsToMatch = [
                {
                    ico: 'stackoverflow',
                    urls: ['*://stackoverflow.tld/*']},
                {
                    ico: 'msdn',
                    urls: ['*://msdn.microsoft.com/*', '*://code.msdn.microsoft.com/*', '*://social.msdn.microsoft.com/*']
                }
            ];

        beforeEach(function () {
            historyFetcherMock.getVisits.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(visitsToUrl);
                return deferred.promise;
            });
        });

        it('returns empty array if no history', function (done) {
            rawHistory = [];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual([]);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('returns only visits from history items with url', function (done) {
            rawHistory = [
                {
                    id: '1234',
                    url: '',
                    title: 'test',
                    lastVisitTime: 1,
                    visitCount: 1,
                    typedCount: 0
                }
            ];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual([]);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('visits with same url and title are added only one time', function (done) {
            rawHistory = [
                {
                    id: '1234',
                    url: 'http://msdn.microsoft.com/test',
                    title: 'test',
                    lastVisitTime: 1,
                    visitCount: 1,
                    typedCount: 0
                }
            ];
            var time = moment().toDate().valueOf();
            visitsToUrl = [
                {time: time, title: 'test', url: 'http://msdn.microsoft.com/test'},
                {time: moment().subtract(5, 'h').toDate().valueOf(), title: 'test', url: 'http://msdn.microsoft.com/test'}
            ];
            var expectedVisits = [
                { time : time, title : 'test', url : 'http://msdn.microsoft.com/test', isGoogleRedirect : false }
            ];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('if google search detected and search has q parameter visits are set with formatted q parameter title', function (done) {
            rawHistory = [
                {
                    id: '1234',
                    url: 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=cerro%20torre',
                    title: 'test',
                    lastVisitTime: 1,
                    visitCount: 1,
                    typedCount: 0
                }
            ];
            var time = moment().toDate().valueOf();
            visitsToUrl = [
                {time: time, title: 'test', url: 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=cerro%20torre'}
            ];
            var expectedVisits = [
                { time : time, title : 'cerro torre', url : 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=cerro%20torre', isGoogleRedirect : false }
            ];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('if google redirect is detected mark the visit as a redirect', function (done) {
            rawHistory = [
                {
                    id: '1234',
                    url: 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU',
                    title: 'test',
                    lastVisitTime: 1,
                    visitCount: 1,
                    typedCount: 0
                }
            ];
            var time = moment().toDate().valueOf();
            visitsToUrl = [
                {time: time, title: 'test', url: 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU'}
            ];
            var expectedVisits = [
                { time : time, title : 'test', url : 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU', isGoogleRedirect : true }
            ];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('must exclude equal adjacent visits with same url', function (done) {
            rawHistory = [
                {
                    id: '1234',
                    url: 'http://msdn.microsoft.com/test',
                    title: 'test',
                    lastVisitTime: 1,
                    visitCount: 1,
                    typedCount: 0
                },
                {
                    id: '1234',
                    url: 'http://msdn.microsoft.com/test',
                    title: 'test',
                    lastVisitTime: 1,
                    visitCount: 1,
                    typedCount: 0
                }
            ];
            var time = moment().toDate().valueOf();
            visitsToUrl = [
                {time: time, title: 'test', url: 'http://msdn.microsoft.com/test'}
            ];
            var expectedVisits = [
                { time : time, title : 'test', url : 'http://msdn.microsoft.com/test', isGoogleRedirect : false }
            ];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });

    });

});
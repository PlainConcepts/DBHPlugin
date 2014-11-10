/* jshint camelcase: false */

describe('developerResourcesHistoryFinder Test', function () {

    'use strict';

    var historyFetcherMock,
        $q,
        $timeout,
        moment,
        developerResourcesHistoryFinder;

    beforeEach(function () {
        historyFetcherMock = jasmine.createSpyObj('historyFetcher', ['getHistory', 'getVisits']);

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('historyFetcher', historyFetcherMock);
        });
    });

    beforeEach(inject(function (_$q_, _$timeout_, _moment_, _developerResourcesHistoryFinder_) {
        $q = _$q_;
        $timeout = _$timeout_;
        moment = _moment_;
        developerResourcesHistoryFinder = _developerResourcesHistoryFinder_;
    }));

    describe('process', function () {

        var rawHistory,
            visitsToUrls,
            urlsToMatch = [
                {
                    ico: 'stackoverflow',
                    name: 'stackoverflow',
                    urls: ['*://stackoverflow.tld/*']
                },
                {
                    ico: 'msdn',
                    name: 'msdn',
                    urls: ['*://msdn.microsoft.com/*', '*://code.msdn.microsoft.com/*', '*://social.msdn.microsoft.com/*']
                }
            ];

        beforeEach(function () {
            historyFetcherMock.getHistory.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(rawHistory);
                return deferred.promise;
            });
            historyFetcherMock.getVisits.and.callFake(function (url) {
                var deferred = $q.defer();
                deferred.resolve(visitsToUrls[url]);
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

        it('returns visits whith the site name and ico', function (done) {
            rawHistory = [{url: 'http://msdn.microsoft.com/test', title: 'test'}];
            visitsToUrls = {
                'http://msdn.microsoft.com/test': [
                    {title: 'test', url: 'http://msdn.microsoft.com/test'}
                ]
            };
            var expectedVisit = {url: 'http://msdn.microsoft.com/test', title: 'test', siteName: 'msdn', ico: 'msdn'};

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits[0].siteName).toEqual(expectedVisit.siteName);
                    expect(visits[0].ico).toEqual(expectedVisit.ico);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('returns only visits from history items with url', function (done) {
            rawHistory = [{url: '', title: 'test'}];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual([]);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('visits with same url and title are added only one time', function (done) {
            rawHistory = [{url: 'http://msdn.microsoft.com/test', title: 'test'}];
            var time1 = moment().toDate().valueOf(),
                time2 = moment().subtract(5, 'h').toDate().valueOf();
            visitsToUrls = {
                'http://msdn.microsoft.com/test': [
                    {time: time1, title: 'test', url: 'http://msdn.microsoft.com/test'},
                    {time: time2, title: 'test', url: 'http://msdn.microsoft.com/test'}
                ]
            };
            var expectedVisit = {time: time1, title: 'test', url: 'http://msdn.microsoft.com/test'};

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits.length).toBe(1);
                    expect(visits[0].url).toEqual(expectedVisit.url);
                    expect(visits[0].title).toEqual(expectedVisit.title);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('if google search detected and search has q parameter visits are set with formatted q parameter title', function (done) {
            rawHistory = [
                {
                    url: 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=.net',
                    title: 'must be replaced'
                },
                {
                    url: 'http://http://msdn.microsoft.com/test',
                    title: 'test'
                }
            ];
            var time1 = moment().toDate().valueOf();
            var time2 = moment().add(15, 's').toDate().valueOf();
            visitsToUrls = {
                'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=.net': [
                    {
                        time: time1,
                        title: 'test',
                        url: 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=.net'
                    }
                ],
                'http://http://msdn.microsoft.com/test': [
                    {time: time2, title: 'test', url: 'http://msdn.microsoft.com/test'}
                ]
            };
            var expectedVisits = [
                {
                    time: time1,
                    title: '.net',
                    url: 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=.net'
                },
                {
                    time: time2,
                    title: 'test',
                    url: 'http://msdn.microsoft.com/test'
                }
            ];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits[0].title).toEqual(expectedVisits[0].title);
                    expect(visits[1].title).toEqual(expectedVisits[1].title);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('if google redirect is detected mark the visit as a redirect, but google redirects are not shown', function (done) {
            rawHistory = [
                {
                    url: 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU',
                    title: 'test'
                }
            ];
            var time = moment().toDate().valueOf();
            visitsToUrls = {
                'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU': [
                    {
                        time: time,
                        title: 'test',
                        url: 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU'
                    }
                ]
            };
            var expectedVisits = [];

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
                    url: 'http://msdn.microsoft.com/test',
                    title: 'test'
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
            visitsToUrls = {
                'http://msdn.microsoft.com/test': [
                    {time: time, title: 'test', url: 'http://msdn.microsoft.com/test'}
                ]
            };
            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits.length).toBe(1);
                }
            ).finally(done);

            $timeout.flush();
        });

        it('must exclude chrome extensions urls', function (done) {
            rawHistory = [
                {
                    url: 'unsafe:chrome-extension://glcllnjdljpjaiomldcdnaficmakabon/filteredUrl.url',
                    title: 'aa'
                }
            ];
            var time = moment().toDate().valueOf();
            visitsToUrls = {
                'unsafe:chrome-extension://glcllnjdljpjaiomldcdnaficmakabon/filteredUrl.url': [
                    {time: time, title: 'aa', url: 'unsafe:chrome-extension://glcllnjdljpjaiomldcdnaficmakabon/filteredUrl.url'}
                ]
            };
            var expectedVisits = [];

            developerResourcesHistoryFinder.process(urlsToMatch, rawHistory).then(
                function success(visits) {
                    expect(visits).toEqual(expectedVisits);
                }
            ).finally(done);

            $timeout.flush();
        });
    });

});
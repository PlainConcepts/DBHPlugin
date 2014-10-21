/* jshint camelcase: false */

describe('historyFetcher Test', function () {

    'use strict';

    var chromeHistoryFetcherMock,
        firefoxHistoryFetcherMock,
        $windowMock;

    beforeEach(function () {
        chromeHistoryFetcherMock = {name: 'chrome'};
        firefoxHistoryFetcherMock = {name: 'firefox'};
        $windowMock = {};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('$window', $windowMock);
            $provide.value('chromeHistoryFetcher', chromeHistoryFetcherMock);
            $provide.value('firefoxHistoryFetcher', firefoxHistoryFetcherMock);
        });
    });

    describe('executing in chrome', function(){

        beforeEach(function(){
            $windowMock.chrome = {};
        });

        it('returns chromeHistoryService instance', inject(function (historyFetcher) {
            expect(historyFetcher).toBe(chromeHistoryFetcherMock);
        }));

    });

    describe('executing in firefox', function(){

        beforeEach(function(){
            $windowMock.prefManager = {};
        });

        it('returns firefoxHistoryService instance', inject(function (historyFetcher) {
            expect(historyFetcher).toBe(firefoxHistoryFetcherMock);
        }));

    });
});
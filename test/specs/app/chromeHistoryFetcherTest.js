/* jshint camelcase: false */

describe('chromeHistoryFetcher Tests', function () {

    'use strict';

    var $windowMock,
        $timeout,
        chromeHistoryFetcher;

    beforeEach(function () {
        $windowMock = {};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('$window', $windowMock);
        });
    });

    beforeEach(inject(function (_$timeout_, _chromeHistoryFetcher_){
        $timeout = _$timeout_;
        chromeHistoryFetcher = _chromeHistoryFetcher_;
    }));

    describe('if not chrome defined', function () {

        it('getHistory rejects an error', function (done) {

            chromeHistoryFetcher.getHistory().then(
                function success() {
                },
                function error(value) {
                    expect(value).toBe('chrome.history not available');
                }
            ).finally(done);

            $timeout.flush();

        });

    });

    describe('if chrome defined but not chrome.history defined', function () {

        beforeEach(function () {
            $windowMock.chrome = {};
        });

        it('getHistory rejects an error', function (done) {

            chromeHistoryFetcher.getHistory().then(
                function success() {
                },
                function error(value) {
                    expect(value).toBe('chrome.history not available');
                }
            ).finally(done);

            $timeout.flush();

        });

    });

    describe('if chrome.history is defined', function () {

        var history = [
            {id: '1234', url: 'http://www.google.com', title: 'Google', lastVisitTime: 1234, visitCount: 2, typedCount: 2}
        ];

        beforeEach(function () {
            $windowMock.chrome = {
                history: {
                    search: function (query, callback) {
                        callback(history);
                    }
                }};
        });

        it('getHistory resolves history data', function (done) {

            chromeHistoryFetcher.getHistory().then(
                function success(data) {
                    expect(data).toBe(history);
                }
            ).finally(done);

            $timeout.flush();

        });

    });
});

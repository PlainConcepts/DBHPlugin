/* jshint camelcase: false */

describe('chromeHistoryService Tests', function () {

    'use strict';

    var $windowMock,
        $timeout,
        chromeHistoryService;

    beforeEach(function () {
        $windowMock = {};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('$window', $windowMock);
        });
    });

    beforeEach(inject(function (_$timeout_, _chromeHistoryService_) {
        $timeout = _$timeout_;
        chromeHistoryService = _chromeHistoryService_;
    }));

    describe('if not chrome defined', function () {

        it('getFilteredHistory rejects an error', function (done) {

            chromeHistoryService.getFilteredHistory().then(
                function success() {
                },
                function error(value) {
                    expect(value).toBe('chrome.history not available');
                }
            ).finally(done); // IMPORTANT: `done` must be called after promise is resolved

            $timeout.flush(); // Force digest cycle to resolve promises

        });

    });

    describe('if chrome defined but not chrome.history defined', function () {

        beforeEach(function () {
            $windowMock.chrome = {};
        });

        it('getFilteredHistory rejects an error', function (done) {

            chromeHistoryService.getFilteredHistory().then(
                function success() {
                },
                function error(value) {
                    expect(value).toBe('chrome.history not available');
                }
            ).finally(done); // IMPORTANT: `done` must be called after promise is resolved

            $timeout.flush(); // Force digest cycle to resolve promises

        });

    });

    describe('if chrome.history is defined', function () {

        var history =[
            {name: 'Google', 'url': 'http://www.google.com'}
        ];

        beforeEach(function () {
            $windowMock.chrome = {
                history: {
                    search: function (query, callback) {
                        callback(history);
                    }
                }};
        });

        it('getFilteredHistory resolves history data', function (done) {

            chromeHistoryService.getFilteredHistory().then(
                function success(data) {
                    expect(data).toBe(history);
                }
            ).finally(done); // IMPORTANT: `done` must be called after promise is resolved

            $timeout.flush(); // Force digest cycle to resolve promises

        });

    });
});

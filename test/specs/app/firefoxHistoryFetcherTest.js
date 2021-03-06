/* jshint camelcase: false */

describe('firefoxHistoryFetcher Tests', function () {

    'use strict';

    var $windowMock,
        $timeout,
        firefoxHistoryFetcher;

    beforeEach(function () {
        $windowMock = {};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('$window', $windowMock);
        });
    });

    beforeEach(inject(function (_$timeout_, _firefoxHistoryFetcher_) {
        $timeout = _$timeout_;
        firefoxHistoryFetcher = _firefoxHistoryFetcher_;
    }));

    describe('getHistory', function(){

        it('getHistory resolves test data', function (done) {

            firefoxHistoryFetcher.getHistory().then(
                function success(data) {
                    expect(data).toEqual(['test']);
                }
            ).finally(done);

            $timeout.flush();

        });

    });

    describe('getVisits', function(){

        it('getVisits resolves test data', function (done) {

            firefoxHistoryFetcher.getVisits().then(
                function success(data) {
                    expect(data).toEqual(['test']);
                }
            ).finally(done);

            $timeout.flush();

        });

    });

});

/* jshint camelcase: false */

describe('firefoxHistoryService Tests', function () {

    'use strict';

    var $windowMock,
        $timeout,
        firefoxHistoryService;

    beforeEach(function () {
        $windowMock = {};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('$window', $windowMock);
        });
    });

    beforeEach(inject(function (_$timeout_, _firefoxHistoryService_) {
        $timeout = _$timeout_;
        firefoxHistoryService = _firefoxHistoryService_;
    }));

    it('getFilteredHistory resolves test data', function (done) {

        firefoxHistoryService.getFilteredHistory().then(
            function success(data) {
                expect(data).toEqual(['test']);
            }
        ).finally(done);

        $timeout.flush();

    });

});

/* jshint camelcase: false */

describe('historyServiceFactoryTest', function () {

    'use strict';

    var chromeServiceMock,
        firefoxServiceMock,
        $windowMock;

    beforeEach(function () {
        chromeServiceMock = {name: 'chrome'};
        firefoxServiceMock = {name: 'firefox'};
        $windowMock = {};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('$window', $windowMock);
            $provide.value('chromeHistoryService', chromeServiceMock);
            $provide.value('firefoxHistoryService', firefoxServiceMock);
        });
    });

    describe('executing in chrome', function(){

        beforeEach(function(){
            $windowMock.chrome = {};
        });

        it('returns chromeHistoryService instance', inject(function (historyServiceFactory) {
            expect(historyServiceFactory).toBe(chromeServiceMock);
        }));

    });

    describe('executing in firefox', function(){

        beforeEach(function(){
            $windowMock.prefManager = {};
        });

        it('returns firefoxHistoryService instance', inject(function (historyServiceFactory) {
            expect(historyServiceFactory).toBe(firefoxServiceMock);
        }));

    });
});
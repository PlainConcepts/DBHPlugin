/* jshint camelcase: false */

describe('historyAnalyzer Test', function () {

    'use strict';

    var historyFetcherMock,
        $timeout,
        historyAnalyzer;

    beforeEach(function () {
        historyFetcherMock = jasmine.createSpyObj('historyFetcher', ['getHistory']);

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.value('historyFetcher', historyFetcherMock);
        });
    });

    beforeEach(inject(function (_$timeout_, _historyAnalyzer_){
        $timeout = _$timeout_;
        historyAnalyzer = _historyAnalyzer_;
    }));

    describe('getFilteredHistory', function(){

        it('returns empty array', function (done) {

            historyAnalyzer.getFilteredHistory().then(
                function success(filteredHistory){
                    expect(filteredHistory).toEqual([]);
                }
            ).finally(done);

            $timeout.flush();

        });

    });

});
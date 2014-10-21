/* jshint camelcase: false */

describe('historyController Test', function () {

    'use strict';

    var $scope,
        $window,
        $q,
        dbhDataContextMock,
        historyFactoryMock;

    beforeEach(function () {
        module('DBHPluginApp');
    });

    beforeEach(inject(function ($rootScope, $controller, _$window_, _$q_) {
        $scope = $rootScope.$new();
        $window = _$window_;
        $q = _$q_;
        dbhDataContextMock = jasmine.createSpyObj('dbhDataContextMock', ['getUrls']);
        historyFactoryMock = jasmine.createSpyObj('historyServiceFactory', ['getFilteredHistory']);

        dbhDataContextMock.getUrls.and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve([
                { ico: 'google', urls: [ '*://*.google.tld/search*'] }
            ]);
            return deferred.promise;
        });

        historyFactoryMock.getFilteredHistory.and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve([
                { name: 'Google', 'url': 'http://www.google.com'}
            ]);
            return deferred.promise;
        });

        $controller('HistoryController', {
            '$scope': $scope,
            'dbhDataContext': dbhDataContextMock,
            'historyServiceFactory': historyFactoryMock
        });
    }));

    it('gets the filtered history of urls', function () {
        $scope.$apply();

        var result = $scope.filteredUrls;

        expect(result).not.toBe([]);
        expect(result.length).toBe(1);
    });
});
/* jshint camelcase: false */

describe('historyControllerTest', function () {

    'use strict';

    var $scope,
        $window,
        $q,
        historyFactoryMock;

    beforeEach(function () {
        module('DBHPluginApp');
    });

    beforeEach(inject(function ($rootScope, $controller, _$window_, _$q_) {
        $scope = $rootScope.$new();
        $window = _$window_;
        $q = _$q_;
        historyFactoryMock = jasmine.createSpyObj('historyServiceFactory',['getFilteredHistory']);

        historyFactoryMock.getFilteredHistory.and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve([{
                name: 'Google',
                'url': 'http://www.google.com'
            }]);
            return deferred.promise;
        });

        $controller('HistoryController', {
            '$scope': $scope,
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
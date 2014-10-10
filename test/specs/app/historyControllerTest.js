describe('historyControllerTest', function () {
    'use strict';

    var $scope, $window;

    beforeEach(function () {
        module('DBHPluginApp');
        window.chrome = {};
    });

    beforeEach(inject(function ($rootScope, $controller, _$window_) {

        $scope = $rootScope.$new();
        $window = _$window_;
        $window.chrome = new TestUtils.ChromeMock();

        $controller('HistoryController', {
            '$scope': $scope
        });
    }));

    it('gets the filtered history of urls', function () {
        $scope.$digest();
        var result = $scope.filteredUrls;
        expect(result).not.toBe([]);
        expect(result.length).toBe(1);
    });
});
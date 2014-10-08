(function () {
    'use strict';

    describe('helloApp module', function () {

        var $scope,
            $helloCtrl;

        beforeEach(module('helloApp'));


        beforeEach(inject(function ($rootScope, $controller) {

            $scope = $rootScope.$new();

            $helloCtrl = $controller('HelloCtrl', {
                $scope: $scope
            });

        }));

        describe('HelloCtrl controller', function () {

            xit('should publish $scope.name', function () {
                expect($scope.name).toBe('world2!');
            });

        });
    });

    describe('Dummy test', function () {

        it('1 should be 1', function () {
            expect(1).toBe(1);
        });

    });

}());
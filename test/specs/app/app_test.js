'use strict';

describe('helloApp module', function() {

    var $scope,
        $helloCtrl;

    beforeEach(module('helloApp'));


    beforeEach(inject(function ($rootScope, $controller) {

        $scope = $rootScope.$new();

        $helloCtrl = $controller('HelloCtrl', {
            $scope: $scope
        });

    }));

    describe('HelloCtrl controller', function(){

        it('should publish $scope.name',function() {
            expect($scope.name).toBe("world2!");
        });

    });
});
var helloApp = angular.module("helloApp", []);
helloApp.controller("HelloCtrl", ['$scope',function($scope) {
	$scope.name = "world!";

}]);
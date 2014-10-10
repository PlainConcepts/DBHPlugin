describe('historyControllerTest', function () {

    var scope, controller;

    beforeEach(function () {
        module('DBHPluginApp');
        window.chrome = {};
    });

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('HistoryController', {
            '$scope': scope
        });
    }));

    it('gets the filtered history of urls', function () {
        expect(scope.filteredUrl).not.toBe('');
    });
});
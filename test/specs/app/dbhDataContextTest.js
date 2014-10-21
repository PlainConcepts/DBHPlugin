/* jshint camelcase: false */

describe('dbhDataContext test', function () {

    'use strict';

    var configMock,
        $httpBackend,
        dbhDataContext;

    beforeEach(function () {
        configMock = {apiBaseUrl: 'http://fake.com/'};

        module('DBHPluginApp', function servicesOverride($provide) {
            $provide.constant('config', configMock);
        });
    });

    beforeEach(inject(function (_$httpBackend_, _dbhDataContext_) {
        $httpBackend = _$httpBackend_;
        dbhDataContext = _dbhDataContext_;
    }));

    describe('getUrls', function () {

        var apiUrls = [
            { ico: 'google', urls: [ '*://*.google.tld/search*'] }
        ];

        it('resolve promise with api data if call returns 200', function (done) {
            var url = configMock.apiBaseUrl + 'urls';
            $httpBackend.when('GET', url).respond(200, apiUrls);
            $httpBackend.expectGET(url);

            dbhDataContext.getUrls().then(
                function success(data) {
                    expect(data).toEqual(apiUrls);
                }
            ).finally(done);

            $httpBackend.flush();

        });

        it('rejects promise if call returns 500', function (done) {
            var url = configMock.apiBaseUrl + 'urls';
            $httpBackend.when('GET', url).respond(500);
            $httpBackend.expectGET(url);

            dbhDataContext.getUrls().then(
                function success() {
                },
                function error(data) {
                    expect(data).toBeUndefined();
                }
            ).finally(done);

            $httpBackend.flush();

        });

    });

});
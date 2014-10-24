/* jshint camelcase: false */

describe('urlAnalyzer Test', function () {

    'use strict';

    var urlAnalyzer;

    beforeEach(function () {
        module('DBHPluginApp');
    });

    beforeEach(inject(function (_urlAnalyzer_) {
        urlAnalyzer = _urlAnalyzer_;
    }));

    describe('isGoogleSearch', function () {

        it('is true when include [/search?]', function () {
            var url = 'https://www.google.es/search?q=.net&oq=.net&aqs=chrome.0.69i59j0j69i65l3j0.1790j0j9&sourceid=chrome&es_sm=93&ie=UTF-8';
            var result = urlAnalyzer.isGoogleSearch(url);

            expect(result).toBeTruthy();
        });

        it('is true when include [output=search]', function () {
            var url = 'https://www.google.es/search?q=.net&output=search';
            var result = urlAnalyzer.isGoogleSearch(url);

            expect(result).toBeTruthy();
        });

        it('is true when include [&q]', function () {
            var url = 'https://www.google.es/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=.net';
            var result = urlAnalyzer.isGoogleSearch(url);

            expect(result).toBeTruthy();
        });

    });

    describe('isGoogleRedirect', function () {

        it('is true when include [/url]', function () {
            var url = 'https://www.google.es/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCoQFjAB&url=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F14863026%2Fjavascript-regex-find-all-possible-matches-even-in-already-captured-matches&ei=qPpIVPaKDsLKOZbcgJgL&usg=AFQjCNGKJJVOYhoq-kfcy4gkxNxBXhkyyw&sig2=VPCIVBZ_eD0xbAo8FscEWA&bvm=bv.77880786,d.ZWU';
            var result = urlAnalyzer.isGoogleRedirect(url);

            expect(result).toBeTruthy();
        });

    });

    describe('getUrlParameters', function () {

        it('detects [?q=]', function () {
            var url = 'https://www.google.es/search?q=.net&oq=.net&aqs=chrome.0.69i59j0j69i65l3j0.1790j0j9&sourceid=chrome&es_sm=93&ie=UTF-8';
            var params = urlAnalyzer.getUrlParameters(url);

            expect(params.q).toBeDefined();
        });

        it('detects [&q=]', function () {
            var url = 'https://www.google.es/search?oq=.net&q=.net&aqs=chrome.0.69i59j0j69i65l3j0.1790j0j9&sourceid=chrome&es_sm=93&ie=UTF-8';
            var params = urlAnalyzer.getUrlParameters(url);

            expect(params.q).toBeDefined();
        });

    });

});
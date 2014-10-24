(function () {
    'use strict';

    function urlAnalyzer() {

        function isGoogleSearch(url) {
            return (url.indexOf('google') !== -1 && url.indexOf('/search?') !== -1) ||
                (url.indexOf('google') !== -1 && url.indexOf('output=search') !== -1 ) ||
                (url.indexOf('google') !== -1 && url.indexOf('&q=') !== -1 );
        }

        function isGoogleRedirect(url) {
            return (url.indexOf('google') !== -1 && url.indexOf('/url') !== -1);
        }

        function getUrlParameters(href) {
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                url = href,
                params = {},
                match;
            match = regex.exec(url);
            while (match) {
                params[match[1]] = match[2];
                match = regex.exec(url);
            }
            return params;
        }

        return {
            isGoogleSearch: isGoogleSearch,
            isGoogleRedirect: isGoogleRedirect,
            getUrlParameters: getUrlParameters
        };
    }

    urlAnalyzer.$inject = [];

    angular
        .module('DBHPluginApp')
        .factory('urlAnalyzer', urlAnalyzer);
})();
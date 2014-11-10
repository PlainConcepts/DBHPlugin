(function () {
    'use strict';

    var urlIco = function (config) {
        return {
            link: function postLink(scope, element, attr) {
                var imageUrl = config.apiBaseUrl + 'ico/' + attr.urlIco;
                element.attr('src', imageUrl);
            }
        };
    };

    urlIco.$inject = ['config'];

    angular
        .module('DBHPluginApp')
        .directive('urlIco', urlIco);

}());
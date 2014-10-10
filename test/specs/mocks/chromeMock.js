var TestUtils = TestUtils || {};

TestUtils.ChromeMock = function(){

    'use strict';

    var history = {
        search: function (query, callback) {
            callback(
                [
                    {
                        name: 'Google',
                        'url': 'http://www.google.com'
                    }
                ]);
        }
    };

    return {
        history: history
    };
};
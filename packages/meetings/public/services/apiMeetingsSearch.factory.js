(function (angular) {
    'use strict';

    angular.module('mean.meetings').factory('/api/meetings/search',
        ['$resource',
        function ($resource) {

        return $resource('/api/meetings/search', {}, {
            'save': { method: 'POST', isArray: true }
        });
    }]);
})(angular);

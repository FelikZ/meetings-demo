(function (angular) {
    'use strict';

    angular.module('mean.meetings').factory('/api/meetings/stats',
        ['$resource',
        function ($resource) {

        return $resource('/api/meetings/stats');
    }]);
})(angular);

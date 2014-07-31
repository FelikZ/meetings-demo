(function (angular) {
    'use strict';

    angular.module('mean.meetings').factory('/api/meetings',
        ['$resource',
        function ($resource) {

        return $resource('/api/meetings');
    }]);
})(angular);

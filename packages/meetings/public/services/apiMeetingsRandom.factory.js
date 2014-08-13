(function (angular) {
    'use strict';

    angular.module('mean.meetings').factory('/api/meetings/random',
        ['$resource',
        function ($resource) {

        return $resource('/api/meetings/random');
    }]);
})(angular);

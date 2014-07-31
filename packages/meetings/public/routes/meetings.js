'use strict';

angular.module('mean.meetings').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('Meetings', {
            url: '/',
            templateUrl: 'meetings/views/index.html'
        });
    }
]);

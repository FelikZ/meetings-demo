(function (angular) {
    'use strict';

    angular.module('mean.meetings').directive('mAlerts', [
        'Status',
        function (Status) {

        return {
            restrict: 'E',
            scope: {
            },
            template:   '<alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)" style="z-index: 9999;">{{alert.msg}}</alert>',
            controller: [
                '$scope',
                '$element',
                '$attrs',
                'Status',
            function ($scope, $element, $attrs, Status) {

                $scope.alerts = Status.getMessages();
            }]
        };
    }]);
})(angular);

(function (angular) {
    'use strict';

    var InfoCtrl = function (Meetings) {

        this.Meetings = Meetings;
        this.info = {
            'avgPeopleCount': 0,
            'totalCount': 0,
            'upcomingMeetingsList': []
        };
    };

    InfoCtrl.prototype.init = function () {

        this.Meetings.getInfo().then(
            function (info) {

                this.info = info;
            }.bind(this)
        );
    };

    angular.module('mean.meetings').controller('main.meetings.InfoCtrl', [
        'Meetings',
        InfoCtrl
    ]);
})(angular);

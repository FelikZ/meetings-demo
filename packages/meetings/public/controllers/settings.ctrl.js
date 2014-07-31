(function (angular) {
    'use strict';

    var SettingsCtrl = function (Meetings) {

        this.Meetings = Meetings;
    };

    SettingsCtrl.prototype.init = function () {

    };

    SettingsCtrl.prototype.onTruncate = function () {

        this.Meetings.truncate();
    };

    angular.module('mean.meetings').controller('main.meetings.SettingsCtrl', [
        'Meetings',
        SettingsCtrl
    ]);
})(angular);

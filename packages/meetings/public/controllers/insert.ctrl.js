(function (angular) {
    'use strict';

    var InsertCtrl = function (Global, Meetings) {

        this.Meetings = Meetings;
        this.maxAmount = Global.config.meetings.maxInsertsPerQuery;
        this.amount = 5000;
        this.topic = '';
    };

    InsertCtrl.prototype.insert = function () {

        this.Meetings.insertRandom(this.amount, this.topic);
    };

    angular.module('mean.meetings').controller('main.meetings.InsertCtrl', [
        'Global',
        'Meetings',
        InsertCtrl
    ]);
})(angular);

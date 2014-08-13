(function (angular) {
    'use strict';

    var SearchCtrl = function (Global, Meetings) {

        this.config = Global.config;
        this.Meetings = Meetings;

        this.query = {};

        this.datePickerShow = {
            start: false,
            end: false
        };

        this.participantsList = this.config.meetings.fakeUserNames;

        this.isopen = false;
        this.hstep = 1;
        this.mstep = 1;
        this.maxLimit = this.config.meetings.maxSearchResults;

        this.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        this.format = 'yyyy-MM-dd';

        this.queryDefault = {
            date_start: null,
            date_end: null,
            participants: [],
            topic: '',
            limit: 5
        };

        this.searchResults = [];
    };

    SearchCtrl.prototype.init = function () {

        this.onClear();
    };

    SearchCtrl.prototype.today = function(which) {

        switch (which) {
            case 'start':
                this.query.date_start = new Date();
                break;
            case 'end':
                this.query.date_end = new Date();
                break;
        }
    };

    SearchCtrl.prototype.openPicker = function($event, which) {

        $event.preventDefault();
        $event.stopPropagation();

        switch (which) {
            case 'start':
            case 'end':
                this.datePickerShow[which] = true;
                break;
        }
    };

    SearchCtrl.prototype.toggleFilters = function () {

        this.isopen = !this.isopen;
    };

    SearchCtrl.prototype.onClear = function () {

        this.query = angular.extend({}, this.queryDefault);
    };

    SearchCtrl.prototype.onSearch = function () {

        this.searchResults = [];
        this.Meetings.search(this.query).then(
            function (results) {

                this.searchResults = results;
            }.bind(this)
        );
    };

    angular.module('mean.meetings').controller('main.meetings.SearchCtrl', [
        'Global',
        'Meetings',
        SearchCtrl
    ]);
})(angular);

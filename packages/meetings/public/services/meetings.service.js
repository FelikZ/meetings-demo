(function (angular) {
    'use strict';

    var Meetings = function ($q, Status, apiMeetingsRandom, apiMeetingsStats, apiMeetingsSearch, apiMeetings) {

        this.$q = $q;
        this.Status = Status;
        this.apiMeetingsRandom = apiMeetingsRandom;
        this.apiMeetingsStats = apiMeetingsStats;
        this.apiMeetingsSearch = apiMeetingsSearch;
        this.apiMeetings = apiMeetings;
    };

    Meetings.prototype.insertRandom = function (amount, topic) {

        var defer = this.$q.defer();

        this.apiMeetingsRandom.save({
                amount: amount,
                topic: topic
            },

            function (response) {
                this.Status.ok();
                defer.resolve();
            }.bind(this),

            function (response) {
                if (response.data) {
                    this.Status.apiError(response.data);
                }
                defer.reject();
            }.bind(this)
        );

        return defer.promise;
    };

    Meetings.prototype.getInfo = function () {

        var defer = this.$q.defer();

        this.apiMeetingsStats.get(
            {},
            function (info) {
                this.Status.ok();
                defer.resolve(info);
            }.bind(this),

            function (response) {
                if (response.data) {
                    this.Status.apiError(response.data);
                }
                defer.reject();
            }.bind(this)
        );

        return defer.promise;
    };

    Meetings.prototype.search = function (query) {

        var defer = this.$q.defer();

        this.apiMeetingsSearch.save(
            query,
            function (results) {
                this.Status.ok();
                for (var i in results) {
                    results[i].duration = parseFloat(
                        (new Date(results[i].date_end) - new Date(results[i].date_start)) / 3600000
                    )
                    .toFixed(1);
                }
                defer.resolve(results);
            }.bind(this),

            function (response) {
                if (response.data) {
                    this.Status.apiError(response.data);
                }
                defer.reject();
            }.bind(this)
        );

        return defer.promise;
    };

    Meetings.prototype.truncate = function () {

        var defer = this.$q.defer();

        this.apiMeetings.remove(
            {},
            function (results) {
                this.Status.ok();
                defer.resolve(results);
            }.bind(this),

            function (response) {
                if (response.data) {
                    this.Status.apiError(response.data, 'Unable to truncate database');
                }
                defer.reject();
            }.bind(this)
        );

        return defer.promise;
    };

    angular.module('mean.meetings').service('Meetings', [
        '$q',
        'Status',
        '/api/meetings/random',
        '/api/meetings/stats',
        '/api/meetings/search',
        '/api/meetings',
        Meetings
    ]);
})(angular);

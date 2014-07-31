(function (angular) {
    'use strict';

    var Status = function ($timeout) {

        this.$timeout = $timeout;
        this.visibleTime = 2500;
        this.messages = [];
    };

    Status.prototype._add = function (type, msg) {

        this.messages.push({
            type: type,
            msg: msg
        });

        this.$timeout(function () {
            this.messages.shift();
        }.bind(this), this.visibleTime);
    };

    Status.prototype.ok = function (msg) {

        msg = msg || 'OK';
        this._add('success', msg);
    };

    Status.prototype.info = function (msg) {

        msg = msg || 'Info';
        this._add('danger', msg);
    };

    Status.prototype.warn = function (msg) {

        msg = msg || 'Warning!';
        this._add('danger', msg);
    };

    Status.prototype.error = function (msg) {

        msg = msg || 'Error!!!';
        this._add('danger', msg);
    };

    Status.prototype.apiError = function (errors, msg) {

        if (!errors) {
            return;
        }

        msg = msg || '';
        var errorsMsg = '';

        for (var i in errors) {

            if (errors[i].msg) {
                errorsMsg += '\n';
                errorsMsg += errors[i].msg + ', ';
            }
        }

        if (errorsMsg.length > 0) {

            msg = msg + errorsMsg.substring(0, errorsMsg.length - 2);
        }

        this.warn(msg);
    };

    Status.prototype.getMessages = function () {
        return this.messages;
    };

    angular.module('mean.meetings').service('Status', [
        '$timeout',
        Status
    ]);
})(angular);

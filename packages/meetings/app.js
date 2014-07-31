'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Meetings = new Module('meetings');

var expressValidator = require('express-validator');
expressValidator.validator.extend('inRange', function (str, from, to) {

    var val = parseInt(str);
    if (isNaN(val) || val < from || val > to) {

        return false;
    }

    return true;
});

Meetings.register(function(app, auth, database) {

    Meetings.routes(app, auth, database);

    return Meetings;
});

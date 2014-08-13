'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var meetingsScheme = new Schema({
    topic: {
        type: String,
        required: true
    },
    date_start: {
        type: Date,
        required: true
    },
    date_end: {
        type: Date,
        required: true
    },
    participants: {
        type: Array,
        required: true
    }
});

mongoose.model('Meetings', meetingsScheme);


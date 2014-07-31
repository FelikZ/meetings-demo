'use strict';

var config = require('meanio').loadConfig(),
    MeetingsAPI = require('../controllers/meetingsAPI');

var meetings = new MeetingsAPI(config.shared.meetings);

module.exports = function(Meetings, app, auth, database) {

    app.route('/api/meetings/random')
        .post(meetings.postRandom.bind(meetings));
    app.route('/api/meetings/stats')
        .get(meetings.getStats.bind(meetings));
    app.route('/api/meetings/search')
        .post(meetings.postSearchMeetings.bind(meetings));
    app.route('/api/meetings')
        .delete(meetings.deleteMeetings.bind(meetings));
};

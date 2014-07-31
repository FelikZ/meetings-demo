'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 8080,
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,
  app: {
    name: 'Meetings test app'
  },
  templateEngine: 'swig',

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },

  // The session cookie name
  sessionName: 'connect.sid',

  // shared between server and client
  shared: {

    // meetings package
    meetings: {

        // Button to insert 5.000 additional meetings with a given topic at random dates with random durations (max 8 hours) and random members out of a list of 10
        maxInsertsPerQuery: 25000,
        // in years
        maxYearsFromNow: 10,
        // in hours
        minDuration: 0.5,
        // in hours
        maxDuration: 8,

        // Show the upcoming 5 meetings starting from today, topic, people, date / time
        upcomingMeetingsCount: 5,
        maxSearchResults: 100,

        info: {
            // Show the average amount of people in the next 20 meetings 
            avgPeopleMeetingsCount: 20,
            // Show the next meeting date of each person
            nextMeetingDatesLimit: 500
        },

        // list of 10 members
        fakeUserNames: [
            'Angelina Jolie',
            'Bruce Willis',
            'Quentin Tarantino',
            'Sandra Balloc',
            'Bred Pitt',
            'Monica Belucci',
            'Fred Quimby',
            'Elvis Presley',
            'Jacky Chan',
            'Arnold Schwarzneger'
        ]
    }
  }
};

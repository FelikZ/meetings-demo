# [![MEAN Logo](http://www.mean.io/img/logos/meanlogo.png)](http://mean.io/) MEAN Stack

[![Build Status](https://travis-ci.org/linnovate/mean.png?branch=master)](https://travis-ci.org/linnovate/mean)
[![Dependencies Status](https://david-dm.org/linnovate/mean.png)](https://david-dm.org/linnovate/mean)

This Demo is based on [mean.io](https://github.com/linnovate/mean) framework.

The original description looks like:

    Build a meeting web application using the following technologies:
    - Node.js 
    - MongoDb
    BONUS:
    - Setup the frontend in AngularJs

    The database contains:
    - Start and end date/time of a meeting
    - Topic of the meeting
    - Names of people in the meeting (max 10)

    The App shows the following
    - Button to insert 5.000 additional meetings with a given topic at random dates with random durations (max 8 hours) and random members out of a list of 10
    - Show the total amount of meetings in the database
    - Show the upcoming 5 meetings starting from today, topic, people, date / time
    - Show the average amount of people in the next 20 meetings
    - Show the next meeting date of each person

    If you have difficulties implementing this in Mongodb, you can use Mysql, Node.js can be PHP, but I prefer that you show me how quickly you adapt new technologies.

**A lot of time was spent on:**

* mongodb documentation;
* mean.io investigation;
* unit testing;
* frontend ui design.

**What is done:**

Single page web application based on mean.io framework which is perfectly suits requirements ( **M**ongo **E**xpress **A**ngularJS **N**odeJS )

    button to insert 5.000 additional meetings with a given topic at random dates with random durations (max 8 hours) and random members out of a list of 10

Implemented at the "Insert" tab, max limit increased up to 25.000

    - Show the total amount of meetings in the database
    - Show the average amount of people in the next 20 meetings

Implemented at the "Information" tab, left column "Stats".

    - Show the next meeting date of each person

Implemented at the "Information" tab, right column "Upcoming meetings"

    - Show the upcoming 5 meetings starting from today, topic, people, date / time

Implemented at the "Search" tab as a "filters". 5 results could be changed in "Limit" filter which is limited by config.

Amount of meetings and other options can be controlled via **config/env/all.js**, there are a lot of options such as: maxInsertsPerQuery, maxSearchResults, maxYearsFromNow, minDuration, maxDuration, upcomingMeetingsCount, avgPeopleMeetingsCount , nextMeetingDatesLimit, fakeUserNames.

**New things learned:**

* testing functions based on Math.random behaviour;
* testing chains (a bit);
* mongodb index-intersections;
* mongodb aggregations;
* usage mapReduce() over group();
* angularjs 1.2+ modern way to organize services / controllers ( via )
* angular.ui.router states;
* angular.ui.bootstrap controls;
* bootstrap itself (a bit);
* mean.io framework basics and deployment process using Grunt.

**How to setup at home:**

1. mongodb 2.6.* should be installed
2. npm / nodejs 0.10.* should be installed
3. git clone https://github.com/FelikZ/meetings-demo.git && cd meetings-demo
4. git checkout -b meetings-demo origin/meetings-demo
5. npm install -g bower
6. npm install -g grunt-cli
7. npm install && cd packages/meetings && npm install && cd ../..
8. bower install
9. NODE_ENV=test grunt test
10. NODE_ENV=production grunt
11. access at htpp://localhost:8080/

**For DB performance it is strongly recommended to add following indexes to meetings db:**

    db.meetings.ensureIndex( { date_start: 1 } )
    db.meetings.ensureIndex( { topic: "hashed" } )
 
DB performance tested within **500.000** of meetings on single node, works pretty fast and this is not a limit.

**Possible improvements / features that should make a world better:**

* should be added ability to manage holidays / weekends and working hours during meeting generation and search;
* dates in DB should be stored in UTC and handled correctly on client-side;
* backend should have common data validation mechanism;
* configs with sensitive data such a passwords shouldn't be controlled by git, it should be stored in separated, ignored via `.gitignore` files. The only EXAMPLE values should be commited in controlled version of config;
* already written tests should cover more fail situations and not all modules are covered yet;
* should be added integration and functional tests, only backend unit tests added right now;
* should be added frontend tests (at least unit tests)
* client-side query caching via localstorage;
* url routing via ui-router;
* frontend templates in separate views;
* CDN support for images / css.

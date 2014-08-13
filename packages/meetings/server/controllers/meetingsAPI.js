'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    Meetings = mongoose.model('Meetings');

var MeetingsAPI = function (config) {
    this.config = config;
};

MeetingsAPI.prototype._shuffle = function (array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

MeetingsAPI.prototype._getRandomDate = function (start, end) {

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

MeetingsAPI.prototype._getRandomMeetingDates = function (minDurationInHours, maxDurationInHours) {

    var minDuration = minDurationInHours * 3600 * 1000; // 3600 sec per hour
    var maxDuration = maxDurationInHours * 3600 * 1000; // 3600 sec per hour

    var minDate = new Date();
    var maxDate = new Date(minDate.getFullYear() + this.config.maxYearsFromNow, minDate.getMonth(), minDate.getDay());
    maxDate = new Date(maxDate.getTime() - (maxDuration + minDuration));

    var startDate = this._getRandomDate(minDate, maxDate);
    var endDate = this._getRandomDate(new Date(startDate.getTime() + minDuration), new Date(startDate.getTime() + maxDuration));

    return {
        start: startDate,
        end: endDate
    };
};

MeetingsAPI.prototype._generateRandomMeetings = function (topic, amount) {

    var meetingsBatch = [];
    amount = parseInt(amount);
    if (isNaN(amount)) {
        return new Error('Amount must be numeric');
    }

    for (var i = 0; i < amount; i++) {

        var participants = this.config.fakeUserNames.slice();
        participants = this._shuffle(participants);
        var participantsCount = Math.floor(Math.random() * this.config.fakeUserNames.length + 1);
        participants = participants.slice(0, participantsCount);

        var dates = this._getRandomMeetingDates(this.config.minDuration, this.config.maxDuration);

        meetingsBatch.push({
            'topic': topic,
            'date_start': dates.start,
            'date_end': dates.end,
            'participants': participants
        });
    }

    return meetingsBatch;
};

MeetingsAPI.prototype.postRandom = function (req, res, next) {

    req.assert('amount', 'You should specify amount of random inserts').notEmpty().isInt().inRange(1, this.config.maxInsertsPerQuery);
    req.assert('topic', 'You should specify topic').isLength(1, 128);

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).send(errors);
        return;
    }

    var meetingsBatch = this._generateRandomMeetings(req.body.topic, req.body.amount);

    var meetings = new Meetings();
    var result = meetings.collection.insert(meetingsBatch, { writeConcern: 'unacknowledged' }, function () {

        if (result.writeConcernError || result.writeError) {

            res.status(400).send();
            return;
        }

        res.status(200).send();
    });
};

MeetingsAPI.prototype.getStats = function (req, res, next) {

    async.parallel({
        totalCount: function (callback) {
            Meetings.count({}, callback);
        },
        avgPeopleCount: function (callback) {

            Meetings.aggregate(
            {
                $match: {
                    'date_start': { $gte: new Date() }
                }
            },
            { $sort: { date_start: 1 } },
            { $limit : this.config.info.avgPeopleMeetingsCount },
            {
                $unwind: '$participants'
            },
            {
                $group:
                {
                    _id: '$_id',
                    size:
                    {
                        $sum: 1
                    },
                    groupAvg: { $addToSet: 1 }
                }
            },
            {
                $group:
                {
                    _id: '$groupAvg',
                    avg:
                    {
                        $avg: '$size'
                    }
                }
            },
            {
                $project:
                {
                    avgPeopleCount: '$avg',
                    _id: 0
                }
            }).exec(function (err, rez) {
                if (err) {
                    callback(err);
                    return;
                }

                if (rez.length === 0) {

                    callback(null, 0);
                    return;
                }

                callback(null, rez[0].avgPeopleCount);
            });
        }.bind(this),

        upcomingMeetingsList: function(callback) {

            Meetings.aggregate(
            {
                $match: {
                    'date_start': { $gte: new Date() }
                }
            },
            { $sort: { date_start: 1 } },
            { $limit: this.config.info.nextMeetingDatesLimit },
            {
                $unwind: '$participants'
            },
            {
                $group:
                {
                    _id: '$participants',
                    min:
                    {
                        $min: '$date_start'
                    }
                }
            },
            { $sort: { min: 1, _id: 1 } },
            {
                $project:
                {
                    participant: '$_id',
                    date: '$min',
                    _id: 0
                }
            }).exec(callback);
        }.bind(this)

    }, function(err, rez) {

        if (err) {
            res.status(400).send();
            return;
        }

        res.status(200).send(rez);
    });

};

MeetingsAPI.prototype.postSearchMeetings = function (req, res, next) {

    var errors = [];

    if (req.body.topic) {

        req.assert('topic', 'Invalid topic').notEmpty().isLength(1, 128);
    }

    if (req.body.date_start) {

        req.assert('date_start', 'Invalid date_start').isDate();
    }

    if (req.body.date_end) {

        req.assert('date_end', 'Invalid date_end').isDate();

        var err = req.validationErrors(true);

        if (err === null) {

            req.assert('date_end', 'Invalid date_end').isAfter(req.body.date_start);
        }
    }

    if (req.body.participants) {

        var participantsError = {
            'param': 'participants',
            'msg': 'Invalid participants',
            'value': req.body.participants
        };

        if (!Array.isArray(req.body.participants)) {

            errors.push(participantsError);
        }
        else if (req.body.participants.length === 0) {

            req.body.participants = null;
        }
        else {

            for (var i in req.body.participants) {

                if (this.config.fakeUserNames.indexOf(req.body.participants[i]) === -1) {

                    errors.push(participantsError);
                    break;
                }
            }
        }
    }

    if (req.body.limit) {

        req.assert('limit', 'Invalid limit').isInt().inRange(1, this.config.maxSearchResults);
    }

    var validatorErrors = req.validationErrors();
    if (validatorErrors) {

        errors = errors.concat(validatorErrors);
    }

    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    var limit = this.config.upcomingMeetingsCount;
    var query = {
        date_start: { $gte: new Date() }
    };

    if (req.body.date_start) {
        query.date_start.$gte = new Date(req.body.date_start);
    }

    if (req.body.date_end) {
        query.date_start.$lt = new Date(req.body.date_end);
    }

    if (req.body.topic) {
        query.topic = req.body.topic;
    }

    if (req.body.participants && req.body.participants.length > 0) {
        query.participants = { $all: req.body.participants };
    }

    if (req.body.limit) {
        limit = req.body.limit;
    }

    Meetings
    .find(query)
    .sort({ date_start: 1 })
    .limit(limit)
    .exec(function (err, rez) {

        if (err) {
            res.status(400).send();
            return;
        }

        res.status(200).send(rez);
    });
};

MeetingsAPI.prototype.deleteMeetings = function (req, res, next) {

    Meetings
    .remove({})
    .exec(function (err, rez) {

        if (err) {
            res.status(400).send();
            return;
        }

        res.status(200).send();
    });
};

module.exports = MeetingsAPI;

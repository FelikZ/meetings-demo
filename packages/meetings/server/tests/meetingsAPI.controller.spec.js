/*jshint expr: true*/
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    should = should,
    sinon = require('sinon'),
    rewire = require('rewire'),
    MeetingsAPI = rewire('../controllers/meetingsAPI');

/**
 * Test Suites
 */
describe('<Unit Test>', function() {

    describe('Controller meetings:', function() {

        var sandbox;
        var maxHours;
        var minHours;
        var MIN_RANDOM_OUTPUT;
        var MAX_RANDOM_OUTPUT;
        var config;
        var MeetingsMock;
        var meetingsObject;
        var async;
        var meetings;
        var request;
        var assert;
        var response;
        var next;

        beforeEach(function(done) {

            sandbox = sinon.sandbox.create();
            maxHours = 8;
            minHours = 0.5;
            MIN_RANDOM_OUTPUT = 0.0;
            MAX_RANDOM_OUTPUT = 0.99999999999;

            config = {
                maxInsertsPerQuery: 25000,
                maxSearchResults: 100,
                maxYearsFromNow: 5,
                minDuration: 0.5,
                maxDuration: 8,
                upcomingMeetingsCount: 5,
                info: {
                    avgPeopleMeetingsCount: 20,
                    nextMeetingDatesLimit: 500
                },
                fakeUserNames: ['Name1', 'Name2', 'Name3']
            };

            MeetingsMock = sandbox.stub();
            MeetingsMock.count = sandbox.stub();
            meetingsObject = sandbox.stub({
                collection: sandbox.stub({
                    insert: function () {}
                })
            });
            MeetingsMock.returns(meetingsObject);

            async = sandbox.stub({
                parallel: function () {}
            });

            MeetingsAPI.__set__('async', async);
            MeetingsAPI.__set__('Meetings', MeetingsMock);
            meetings = new MeetingsAPI(config);

            request = sandbox.stub({
                assert: function () {},
                validationErrors: function () {},
                body: {
                    topic: 'Test',
                    amount: 4
                }
            });

            assert = sandbox.stub({
                notEmpty: function () {},
                isInt: function () {},
                inRange: function () {},
                isLength: function () {}
            });
            assert.notEmpty.returns(assert);
            assert.isInt.returns(assert);
            assert.inRange.returns(assert);
            assert.isLength.returns(assert);

            request.assert.returns(assert);

            response = sandbox.stub({
                status: function () {},
                send: function () {}
            });

            response.status.returns(response);
            response.send.returns(response);

            next = sandbox.spy();

            done();
        });

        describe('_shuffle', function() {

            var testArray;
            beforeEach(function(done) {

                testArray = ['first', 'second', 'third'];
                sandbox.stub(Math, 'random');
                done();
            });

            it('should not modify array elements order if Math.random will always return maximum 0.99999', function(done) {

                Math.random.returns(MAX_RANDOM_OUTPUT);
                var backupTestArray = testArray.slice();
                var result = meetings._shuffle(testArray);

                result.should.be.equal(testArray);
                result.should.be.eql(backupTestArray);
                done();
            });
        });

        describe('_getRandomDate', function() {

            var minDate;
            var maxDate;

            beforeEach(function(done) {

                minDate = new Date(2014, 8, 29);
                maxDate = new Date(2015, 12, 1);

                sandbox.stub(Math, 'random');
                done();
            });

            it('should return min date if Math.random generates minimum output', function(done) {

                Math.random.returns(MIN_RANDOM_OUTPUT);
                var result = meetings._getRandomDate(minDate, maxDate);
                result.should.be.eql(minDate);
                done();
            });

            it('should return date between min and max dates if Math.random generates avg output', function(done) {

                Math.random.returns(0.65);
                var result = meetings._getRandomDate(minDate, maxDate);
                result.should.be.an.instanceOf(Date);

                result.getTime().should.be.within(minDate.getTime(), maxDate.getTime());
                done();
            });

            it('should return (max date -1 sec) if Math.random generates max output', function(done) {

                Math.random.returns(MAX_RANDOM_OUTPUT);
                var result = meetings._getRandomDate(minDate, maxDate);
                result.should.be.eql(new Date(maxDate.getTime() - 1));
                done();
            });
        });

        describe('_getRandomMeetingDates', function() {

            it('should return object with random dates that fits to given duration', function(done) {

                var result = meetings._getRandomMeetingDates(minHours, maxHours);

                result.should.be.an.Object.and
                .have.properties('start', 'end');

                result.start.should.be.an.instanceOf(Date);
                result.end.should.be.an.instanceOf(Date);

                var minHoursInSeconds = minHours * 3600 * 1000;
                var maxHoursInSeconds = maxHours * 3600 * 1000;

                var diff = result.end.getTime() - result.start.getTime();
                diff.should.be.within(minHoursInSeconds, maxHoursInSeconds);

                done();
            });
        });

        describe('_generateRandomMeetings', function() {

            it('should return an array of random generated meetings', function(done) {

                var topic = 'New project in April';
                var amount = 11;

                var result = meetings._generateRandomMeetings(topic, amount);

                result.should.be.an.Array.and.have.lengthOf(amount);

                for (var i = 0; i < amount; i++) {

                    result[i].should.be.an.Object.with.properties(
                        'topic',
                        'date_start',
                        'date_end',
                        'participants'
                    );

                    result[i].topic.should.be.a.String.and.be.equal(topic);
                    result[i].date_start.should.be.an.instanceOf(Date);
                    result[i].date_end.should.be.an.instanceOf(Date);
                    result[i].participants.should.be.an.instanceOf(Array);
                    var length = result[i].participants.length;
                    length.should.be.within(1, 10);
                }

                done();
            });
        });

        describe('postRandom', function() {

            beforeEach(function(done) {

                sandbox.stub(meetings, '_generateRandomMeetings');
                done();
            });

            it('should test input arguments with request assert', function(done) {

                meetings.postRandom(request, response, next);

                request.assert.calledWith('amount', sinon.match.string).should.be.true;
                request.assert.calledWith('topic', sinon.match.string).should.be.true;
                done();
            });

            it('should throw 400 code on invalid params', function(done) {

                var errors = [{'msg': 'some error'}];
                request.validationErrors.returns(errors);
                meetings.postRandom(request, response, next);

                request.validationErrors.called.should.be.true;
                response.status.alwaysCalledWithExactly(400).should.be.true;
                response.send.calledAfter(response.status).should.be.true;
                response.send.calledOnce.should.be.true;
                response.send.calledWithExactly(errors).should.be.true;

                meetings._generateRandomMeetings.called.should.not.be.true;
                done();
            });

            it('should call _generateRandomMeetings with correct arguments', function(done) {

                request.validationErrors.returns(null);
                meetings.postRandom(request, response, next);

                meetings._generateRandomMeetings.calledWithExactly(request.body.topic, request.body.amount).should.be.true;
                done();
            });

            it('should call meetings.collection.insert with correct arguments', function(done) {

                var validOutput = { 'valid': 'data' };

                request.validationErrors.returns(null);
                meetings._generateRandomMeetings.returns(validOutput);

                meetings.postRandom(request, response, next);

                MeetingsMock.calledWithNew().should.be.true;
                meetingsObject.collection.insert.calledWithExactly(validOutput, { writeConcern: 'unacknowledged' }, sinon.match.func).should.be.true;

                done();
            });

            it('should return send status 200 on valid insert', function(done) {

                var validResponse = {'nInserted': 1};

                request.validationErrors.returns(null);
                meetingsObject.collection.insert.returns(validResponse);

                meetings.postRandom(request, response, next);

                meetingsObject.collection.insert.callArg(2);

                response.status.alwaysCalledWithExactly(200).should.be.true;
                response.send.calledAfter(response.status).should.be.true;
                response.send.calledOnce.should.be.true;

                done();
            });

            it('should return send status 400 on invalid insert due to writeConcernError', function(done) {

                var validResponse = {'nInserted': 0, 'writeConcernError': true };

                request.validationErrors.returns(null);
                meetingsObject.collection.insert.returns(validResponse);

                meetings.postRandom(request, response, next);

                meetingsObject.collection.insert.callArg(2);

                response.status.alwaysCalledWithExactly(400).should.be.true;
                response.send.calledAfter(response.status).should.be.true;
                response.send.calledOnce.should.be.true;

                done();
            });

            it('should return send status 400 on invalid insert due to writeError', function(done) {

                var validResponse = {'nInserted': 0, 'writeError': true };

                request.validationErrors.returns(null);
                meetingsObject.collection.insert.returns(validResponse);

                meetings.postRandom(request, response, next);

                meetingsObject.collection.insert.callArg(2);

                response.status.alwaysCalledWithExactly(400).should.be.true;
                response.send.calledAfter(response.status).should.be.true;
                response.send.calledOnce.should.be.true;

                done();
            });
        });

        describe('getInfo', function() {

            var totalCount;
            var validResponse;

            beforeEach(function(done) {

                totalCount = 6;
                validResponse = {
                    totalCount: totalCount
                };
                done();
            });

            it('should call all callbacks in all parallel tasks', function(done) {

                var cbCount = sandbox.spy();

                MeetingsMock.count.callsArgWith(1, null, totalCount);
                async.parallel.yieldsTo('totalCount', cbCount);

                meetings.getInfo(request, response, next);

                async.parallel.calledWith(
                    sinon.match({
                        totalCount: sinon.match.func
                    }),
                    sinon.match.func
                ).should.be.true;
                MeetingsMock.count.calledWithExactly({}, cbCount).should.be.true;
                cbCount.calledWithExactly(null, totalCount).should.be.true;

                done();
            });

            it('should send status 200 with info if no error occured', function(done) {

                async.parallel.callsArgWith(1, null, validResponse);

                meetings.getInfo(request, response, next);

                response.status.alwaysCalledWithExactly(200).should.be.true;
                response.send.calledAfter(response.status).should.be.true;
                response.send.calledOnce.should.be.true;
                response.send.calledWithExactly(validResponse).should.be.true;
                done();
            });

            it('should send status 400 without info if error occured', function(done) {

                async.parallel.callsArgWith(1, {'msg': 'some error'}, validResponse);

                meetings.getInfo(request, response, next);

                response.status.alwaysCalledWithExactly(400).should.be.true;
                response.send.calledAfter(response.status).should.be.true;
                response.send.calledOnce.should.be.true;
                response.send.calledWithExactly().should.be.true;
                done();
            });
        });

        afterEach(function( done) {

            sandbox.restore();
            done();
        });
    });
});

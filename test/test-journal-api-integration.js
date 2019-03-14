'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const Journal = require('../app/models/journal');
const User = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config/database');

chai.use(chaiHttp);

function seedJournalData() {
    console.info('seeding journal data');
    const seedData = [];

    for (let i = 1; i <= 5; i++) {
        seedData.push(generateJournalData());
    }
    // this will return a promise
    return Journal.insertMany(seedData);
}
function generateJournalData(id) {
    const testID = User.findOne({ "email": 'test@journaltest.com' });
    var things = []
    for (let i = 0; i < 3; i++) {
        things.push(faker.lorem.sentence())
    }
    var thingsfive = []
    for (let i = 0; i < 5; i++) {
        thingsfive.push(faker.lorem.sentence())
    }
    var thingsthree = []
    for (let i = 0; i < 3; i++) {
        thingsthree.push(faker.lorem.words(1))
    }

    return {
        morningRating: faker.random.number(10),
        excitedAbout: things,
        priorities: thingsfive,
        eveningRating: faker.random.number(10),
        describeToday: thingsthree,
        todayWins: things,
        toImprove: faker.lorem.sentences(),
        gratitude: things,
        journalEntry: faker.lorem.sentences(),
        user: testID._id

    };
}

function createTestUser() {
    return chai.request(app)
        .post('/signup')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
            email: 'test@journaltest.com',
            emailv: 'test@journaltest.com',
            password: 'test',
            passwordv: 'test'
        })
        .end(function () {
        })
}
// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('User API resource', function () {
    // we need each of these hook functions to return a promise
    // otherwise we'd need to call a `done` callback. `runServer`,
    // `seedBlogData` and `tearDownDb` each return a promise,
    // so we return the value returned by these function calls.
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        createTestUser();
        return seedJournalData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET dashboard endpoint', function () {
        // strategy:
        // 1. create a user sign in
        it('should log in the user and render dashboard page', function () {
            let res;
            let logUser = {
                email: 'test@journaltest.com',
                password: 'test'
            }
            return chai.request(app)
                .post('/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    email: 'test@journaltest.com',
                    password: 'test'
                })
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return User.findOne({ "email": logUser.email });
                })
                .then(function (user) {
                    expect(user).to.not.be.null;
                    expect(user.email).to.equal(logUser.email);
                    return user.validPassword(logUser.password);
                })
                .then(function (passwordIsCorrect) {
                    expect(passwordIsCorrect).to.be.true;
                });
        });
    });
   
});

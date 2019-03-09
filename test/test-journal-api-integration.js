'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Journal } = require('../app/models/journal');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config/database');

chai.use(chaiHttp);

function seedJournalData() {
    console.info('seeding journal data');
    const seedData = [];

    for (let i = 1; i <= 31; i++) {
        seedData.push(generateJournalData());
    }
    // this will return a promise
    return Journal.insertMany(seedData);
}
function generateBlogData() {
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
        user: "5c8324506c9fbb5e7081ec21"

    };
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


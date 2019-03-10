'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const  User  = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config/database');

chai.use(chaiHttp);

function seedUserData() {
    console.info('seeding blog data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateUserData());
    }
    // this will return a promise
    return User.insertMany(seedData);
}

function generateUserData() {
    let testEmail = faker.internet.email()
    let testPassword = faker.lorem.words(1)
    return {
        email: testEmail,
        emailv: testEmail,
        password: testPassword,
        passwrodv: testPassword
    }
};
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
        return seedUserData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET / endpoint', function () {
        // strategy:
        // 1. render the home page
        it('should render the homepage page', function () {
            return chai.request(app)
                .get('/login')
                .then(function () {
                    expect('Location', '/')
                })
        });
    });
    describe('GET login endpoint', function () {
        // strategy:
        // 1. render the login page
        it('should render the login page', function () {
            return chai.request(app)
                .get('/login')
                .then(function () {
                    expect('Location', '/login')
                })
        });
    });
    // describe('POST login endpoint', function () {
    //     // strategy:
    //     // 1. get and existing log in from the DB
    //     // 2. make a POST request and get redirected to user dashboard
    //     it('should render the dashboard page', function () {
    //         const logUser = {
    //             email: testEmail,
    //             passwrod: testPassword
    //         }
    //         return User.findOne() 
    //         .then(function(user) {
    //             logUser.email = user.email
    //             logUser.password = user.password
    //         }
    //         return chai.request(app)
    //             .get('/login')
    //             .then(function () {
    //                 expect('Location', '/login')
    //             })
    //     });
    // });
});
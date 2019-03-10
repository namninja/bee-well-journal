'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const User = require('../app/models/user');
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

    // afterEach(function () {
    //     return tearDownDb();
    // });

    after(function () {
        return closeServer();
    });
    describe('GET / endpoint', function () {
        // strategy:
        // 1. render the home page
        it('should render the homepage page', function () {
            let res;
            return chai.request(app)
                .get('/login')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect('Location', '/')
                })
        });
    });
    describe('GET login endpoint', function () {
        // strategy:
        // 1. render the login page
        it('should render the login page', function () {
            let res;
            return chai.request(app)
                .get('/login')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect('Location', '/login');
                })
        });
    });
    describe('POST login endpoint', function () {
        // strategy:
        // 1. get and existing log in from the DB
        // 2. make a POST request and get redirected to user dashboard
        it('should render the dashboard page', function () {
            const logUser = {
            }
            return User.findOne()
                .then(function (user) {
                    logUser.email = user.email
                    logUser.password = user.password
                    let res;
                    return chai.request(app)
                        .post('/login')
                        .send(logUser)
                        .then(function (_res) {
                            res = _res;
                            expect(res).to.have.status(200);
                            expect('Location', '/dashboard')
                        })
                })
        });
    });
    describe('GET signup endpoint', function () {
        // strategy:
        // 1. render the login page
        it('should render the login page', function () {
            let res;
            return chai.request(app)
                .get('/signup')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect('Location', '/signup');
                })
        });
    });
    describe('POST signup endpoint', function () {
        // strategy:
        // 1. get and existing log in from the DB
        // 2. make a POST request and get redirected to user dashboard
        it('should render the dashboard page', function () {

            const newUser = generateUserData()
            console.log(newUser,'----------------------new')
            let res;
            return chai.request(app)
                .post('/signup')
                .send(newUser)
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect('Location', '/dashboard')
                    console.log(res.body.id, '---------------------------------yoyoyoy')
                    return User.findOne({"email": newUser.email}); // need help here
                })
                .then(function(user) {
                    console.log(user,'------------------user')
                    expect(user.email).to.equal(newUser.email);
                    expect(user.password).to.equal(newUser.password);
                })
        })
    });
});

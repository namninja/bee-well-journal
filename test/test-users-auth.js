'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');


const expect = chai.expect;

const User = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config/database');

chai.use(chaiHttp);

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

    });

    afterEach(function () {
        // return tearDownDb();
    });

    after(function () {
        return closeServer();
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
                })
        });
    });
    describe('POST login endpoint', function () {
        // strategy:
        // 1. create a user then log in as that user
        // 2. make a POST request and get redirected to user dashboard
        it('should render the dashboard page', function () {
            let res;
            let logUser = {
                email: 'test@test.com',
                emailv: 'test@test.com',
                password: 'test',
                passwrodv: 'test'
            }
            return chai.request(app)
                .post('/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    email: 'test@test.com',
                    emailv: 'test@test.com',
                    password: 'test',
                    passwordv: 'test'
                })
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return chai.request(app)
                        .post('/login')
                        .set('content-type', 'application/x-www-form-urlencoded')
                        .send(logUser)
                        .then(function (_res) {
                            res = _res;
                            expect(res).to.have.status(200);
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
                })
        });
    });
    describe('POST signup endpoint', function () {
        // strategy:
        // 1. get and existing log in from the DB
        // 2. make a POST request and get redirected to user dashboard
        it('should render the dashboard page', function () {
            let res;
            let newUser = {
                email: 'test@test.com',
                emailv: 'test@test.com',
                password: 'test',
                passwrodv: 'test'
            }
            return chai.request(app)
                .post('/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    email: 'test@test.com',
                    emailv: 'test@test.com',
                    password: 'test',
                    passwordv: 'test'
                })
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return User.findOne({"email": newUser.email });
                })
                .then(function (user) {
                    expect(user).to.not.be.null;
                    expect(user.email).to.equal(newUser.email);
                    return user.validPassword(newUser.password);
                })
                .then(function(passwordIsCorrect) {
                    expect(passwordIsCorrect).to.be.true;
                });
                
        });
    });
});
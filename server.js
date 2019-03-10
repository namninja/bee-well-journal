// get all tools we need
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const { PORT, DATABASE_URL } = require("./config/database.js");
const SECRET = process.env.SECRET;
var moment = require('moment');
var shortDateFormat = "ddd, MMM DD YYYY"; // this is just an example of storing a date format once so you can change it in one place and have it propagate
app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;
const faker = require('faker');
const Journal = require('./app/models/journal');

// configuration
require('./config/passport'); // pass passport for configuration 

// set up our express application

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '/public'))); 
app.use('/', express.static(path.join(__dirname, '/public')));


app.use(express.static('public'));

app.set('view engine', 'ejs'); // set up ejs for templating

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
  });

// required for passport
app.use(session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true 
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
const router = require('./app/routes.js'); // load our routes and pass in our app and fully configured passport
app.use("/", router)

const journalRouter = require('./app/journal-router.js'); // load our routes and pass in our app and fully configured passport
app.use("/", journalRouter)

// launch ======================================================================

  // closeServer needs access to a server object, but that only
  // gets created when `runServer` runs, so we declare `server` here
  // and then assign a value to it in run
  let server;

  // this function connects to our database, then starts the server
  function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.set('debug', true);
      mongoose.connect(
        databaseUrl,
        err => {
          if (err) {
            return reject(err);
          }
          server = app
            .listen(port, () => {
              console.log(`Your app is listening on port ${port}`);
              resolve();
            })
            .on("error", err => {
              mongoose.disconnect();
              reject(err);
            });
        }
      );
    });
  }

  // this function closes the server, and returns a promise. we'll
  // use it in our integration tests later.
  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

  // if server.js is called directly (aka, with `node server.js`), this block
  // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
  if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Journal = require('./models/journal');

router.get('/new-journal', function (req, res) {
    res.render('new-journal.ejs', { user: req.user }); // load the index.ejs file
});


router.post('/new-journal', jsonParser, function(req, res) {
    const newEntry = new Journal(req.body)
    console.log(req.body)
    res.status(201)
})

module.exports = router
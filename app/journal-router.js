const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('./models/user')
const Journal = require('./models/journal');

router.get('/journal/:id', function (req, res) {
    console.log(req.params.id, '===========================================here')
    Journal.find({ "_id": req.params.id }, function (err, journal) {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log(journal, '===========================================now')
            res.render('journal.ejs', { 
                journal 
                
            }); // load the index.ejs file
        }
    });

});


module.exports = router
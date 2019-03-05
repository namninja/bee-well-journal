const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('./models/user')
const Journal = require('./models/journal');

router.get('/new-journal', function (req, res) {
   
    res.render('new-journal.ejs', { user: req.user }); // load the index.ejs file
});


router.post('/new-journal', jsonParser, function(req, res) {
    // const newEntry = new Journal(req.body)
    
    User.findById(req.user._id)
      .then(user => {
        
        if (user) {
            let today = new Date();
            req.body.user = req.user._id;
          Journal.create(req.body) 
            // .then(blog => res.status(201).json(blog.serialize()))
            .then(journal => res.status(201).json({
              id: journal.id
            }))
            .catch(err => {
              console.error(err);
              res.status(500).json({ message: "Internal server error" });
            });
        } else {
          const message = 'user not found';
          console.error(message);
          return res.status(400).send(message);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
})

module.exports = router
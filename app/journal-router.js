const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const User = require('./models/user')
const Journal = require('./models/journal');
const moment = require('moment');

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// Dashboard SECTION =====================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    router.get('/dashboard', isLoggedIn, function (req, res) {
        Journal.find({"user" : req.user.id}, function(err, journal) {
            if(err) {
                res.status(500).send(err);
            } else {
        res.render('dashboard.ejs', {
            user: req.user,
            journals: journal
           
              // get the user out of session and pass to template
        });
    }});
});

router.get('/mood-data', isLoggedIn, function (req, res) {
    console.log(req)
    Journal.find({user: req.user._id})
      .then(journals => {
        console.log(journals.length)
        res.json(
          journals.map(journal => journal.moodData())
        );
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
});


router.get('/create-journal', isLoggedIn, function (req, res) {
   
    res.render('create-journal.ejs', { user: req.user, journal: null }); // load the index.ejs file
});



router.post('/create-journal',  isLoggedIn, jsonParser, function(req, res) {
    // const newEntry = new Journal(req.body)
    
    User.findById(req.user._id)
      .then(user => {
        
        if (user) {
            let today = new Date();
            req.body.user = req.user._id;
          Journal.create(req.body) 
            // .then(blog => res.status(201).json(blog.serialize()))
            .then(res.redirect("/dashboard"))
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

router.get('/create-journal/:id',isLoggedIn, function (req, res) {
    
    Journal.findOne({ "_id": req.params.id }, function (err, journal) {
        if (err) {
            res.status(500).send(err);
        } else {
     
            res.render('create-journal.ejs', {
                journal: journal,
                user: req.user

            }); // load the index.ejs file
        }
    });

});

router.post('/create-journal/:id',isLoggedIn, function (req, res) {
    
 console.log(req.body)
    Journal
        .findOneAndUpdate({_id:req.params.id},req.body, {new : true})
        .then(journal => res.redirect("/journal/"+req.params.id))
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.get('/journal/:id', isLoggedIn, function (req, res) {
    
    Journal.find({ "_id": req.params.id }, function (err, journal) {
        if (err) {
            res.status(500).send(err);
        } else {
            
            res.render('journal.ejs', { 
                journal 
                
            }); // load the index.ejs file
        }
    });

});

router.delete('/delete-journal/:id', isLoggedIn, function (req, res) {
    console.log(req.params.id)
    Journal.findByIdAndRemove(req.params.id)
    .then(blog => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
  });

module.exports = router
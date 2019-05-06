var express = require('express');

var router = express.Router();

var passport = require('passport');

var localStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

var ObjectID = require('mongodb').ObjectID;
//const querystring = require('querystring');    
 
var db = mongoose.connection;

var User = require('../models/user.js');
var Ureq = require('../models/update_requests.js');
 

router.get('/login',function(req,res){

                res.render('client_login');

});

 

router.get('/register', function(req,res){

                res.render('client_register');

});

 

router.get('/logout', function(req, res){

  req.logout();

  req.flash('success_msg' , "You are now logged out");

  res.redirect('/login');

});

 

router.get('/home', ensureAuthenticated, function(req,res){

  res.render('client_home',{username: req.user.username});

});

router.get('/supplier_collaborate', ensureAuthenticated, function(req, res){
  var message = req.session.message;
  console.log(message);
  res.render('collaboration_page_supplier', { supplier_name: req.user.company, message: message});
}) 

router.post('/register',  function (req, res) {

  var name = req.body.name;

  var username = req.body.uname;

  var email = req.body.email;

  var company = req.body.oname;

  var role = req.body.role;

  var pass = req.body.npass;

  var cpass = req.body.cpass;

 

  //validation

  req.checkBody('name', 'Name is required').notEmpty();

  req.checkBody('uname', 'User Name is required').notEmpty();

  req.checkBody('email', 'Email is required').notEmpty();

  req.checkBody('email', 'Email is not valid').isEmail();

  req.checkBody('oname', 'Company name is required').notEmpty();

  req.checkBody('npass', 'Password is required').notEmpty();

  req.checkBody('cpass', 'Passwords do not match').equals(req.body.npass);

 

  var errors = req.validationErrors();

 

  if(errors){

                res.render('client_register', {

                                errors:errors

                });

  }

  else{

                var newUser = new User({

                                name: name,

                                username: username,

                                email: email,

                                company: company,

                                role: role,

                                password: pass

                });

 

                User.createUser(newUser, function(err, user){

                                if(err) throw err;

                                console.log(user);

                });

 

                req.flash('success_msg', 'You have successfully registered and can now login');

 

                res.redirect('/login');

  }

 

});

 

passport.use(new localStrategy(

  function(username, password, done) {

    User.getUserByUsername(username,function(err, user){

      if(err) throw err;

      if(!user){

        return done(null, false, {message: 'Unknown user'});

      }

      User.comparePassword(password, user.password, function(err, isMatch){

        if(err) throw err;

        if(isMatch){

          return done(null, user);

        }

        else{

          return done(null, false, {message: 'Invalid password'});

        }

      });

    });

  }));

passport.serializeUser(function(user, done) {

  done(null, user.id);

});

passport.deserializeUser(function(id, done) {

  User.login(id, function(err, user) {
    if(err) return done(err, null);
    done(err, user);
   });

});

router.post('/login',

  passport.authenticate('local' , {failureRedirect:'/login', failureFlash: true}),

  function(req, res) {
    req.session.user = req.user;
    //console.log(new Date(Date.now()).toLocaleString());
    if(req.user.role === "Buyer"){
      res.redirect('/home?' + req.user.username);
    }else{
  
      //console.log(req.user.last_login_date);
      //console.log(new Date(Date.now()));
      Ureq.aggregate([

        {$match:

          {

            $and: [ 
              {supplier_id: new ObjectID(req.user._id)},
              {'data_exchange.time_exc': {$gt: req.user.last_login_date, $lte: new Date(Date.now())}}
            ]
          }

        },

        {

          $unwind: "$data_exchange"

        },

        {
           $project:

          {

            _id: 0,

            req_id: 1,

            sender_id: "$data_exchange.sender_id",

            receiver_id: "$data_exchange.receiver_id",

            msg_title: "$data_exchange.message_sub",

            msg_body: "$data_exchange.message_content"

          }

        }

      ],
      function(err, upd){
        if(err) throw err;

        //console.log(upd);
        req.session.message = upd;
        res.redirect('/supplier_collaborate');
      }
      ); 
     // res.redirect('/supplier_collaborate?' + req.user.company);
    }
  });

function ensureAuthenticated(req, res, next){

  if(req.isAuthenticated()){

    return next();

  }else{

    req.flash('error_msg', 'You are not logged in');

    res.redirect('/login');

  }

}

module.exports = router;
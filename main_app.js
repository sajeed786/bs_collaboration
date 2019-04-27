var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');

var expValidator = require('express-validator');

var flash = require('connect-flash');

var session = require('express-session');

var passport = require('passport');

var localStrategy = require('passport-local').Strategy;

var mongo = require('mongodb');

var mongoose = require('mongoose');

 

mongoose.connect('mongodb://localhost/loginapp');



 

//Initialise App

var app = express();

 

//routes to be used

var users = require('./routes/users');
var nreqs = require('./routes/new_req');
 

//Set view engine

app.set('views', __dirname + '/views');

app.engine('handlebars', exphbs({defaultLayout:'layout'}));

app.set('view engine','handlebars');

 

//body-parser middleware

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

 

//expose static files through public folder

app.use(express.static(path.join(__dirname, 'public')));

 

//express session

app.use(session({

                secret: 'secret',

                saveUninitialized: true,

                resave: true

}));

 

//passport initialization

app.use(passport.initialize());

app.use(passport.session());

 

//express validator

app.use(expValidator({

  errorFormatter: function(param, msg, value) {

      var namespace = param.split('.')

      , root    = namespace.shift()

      , formParam = root;

 

    while(namespace.length) {

      formParam += '[' + namespace.shift() + ']';

    }

    return {

      param : formParam,

      msg   : msg,

      value : value

    };

  }

}));  

 

//connect flash

app.use(flash());

 

//global variables for success and error msgs

app.use(function(req, res, next){

                res.locals.success_msg = req.flash('success_msg');

                res.locals.error_msg = req.flash('error_msg');

                res.locals.error = req.flash('error');

                res.locals.user = req.user || null;

                next();

})

 

app.use('/',users);
app.use('/',nreqs);
 

var port = 4000;

app.listen(port, function(){

                console.log("server listening on port: " + port);

});

 
var express = require('express');

var router = express.Router();

var Nreq = require('../models/new_request.js');

//routes

router.get('/buyer_send', function(req, res){

                res.render('collaboration_page_buyer');

});

 

router.post('/buyer_send', function(req,res){

                var msg_content = req.body.content;

                var msg_title  = "First request to a supplier";

                var supp1 = req.body.supplier_1;

                var supp2 = req.body.supplier_2;

                var supp3 = req.body.supplier_3;

 

                var recv_list = [supp1, supp2, supp3];

 

                var newRequest = new Nreq({

                                receiver_list: recv_list,

                                message_title: msg_title,

                                message_content: msg_content

                });

 

                Nreq.createRequest(newRequest, function(err, request){

                                if(err) throw err;

                                console.log(request);

                });

 

                req.flash('success_msg', 'Message has been successfully sent');

 

                res.redirect('/buyer_send');

});

 

router.post('/home' , function(req, res){

  if(req.body.requesttype === "new request"){

    res.redirect('/buyer_send');

  }

  else if (req.body.requesttype === "request in process"){

    res.end('Your request is in process');

  }

});

module.exports = router;
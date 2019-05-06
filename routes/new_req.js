var express = require('express');
var async = require('async');
var router = express.Router();

var Nreq = require('../models/new_request.js');
var User = require('../models/user.js');
var Req_update = require('../models/update_requests.js');

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

 
                var send_time = new Date(Date.now());
                var recv_list = [supp1, supp2, supp3];

                var newRequest = new Nreq({

                                receiver_list: recv_list,

                                message_title: msg_title,

                                message_content: msg_content,

                                send_date: send_time.toLocaleString()

                });

 

                Nreq.createRequest(newRequest, function(err, request){

                                if(err) throw err;

                                console.log(request);

                                var req_id = request._id;
                
                                var recv_id = [];
                                var role = "Supplier";
                                var sender_id, sender_role;
                                 
                                // console.log(User.getUserByCompany(recv_list, i, role, recv_id));
                                async.each(recv_list, function(recv, callback) {

                                  //Returning callback is must. Else it wont get the final callback, even if we miss to return one callback
                                  User.getUserByCompany(recv, recv_id, role, callback);
                                
                                }, function(err) {
                                  //If any of the user search failed may throw error.
                                  if( err ) {
                                    console.log('something unexpected happened while finding user');
                                  } else {
                                    console.log('All receivers found');
                                    if(req.session.user)
                                    {
                                      sender_id = req.session.user._id;
                                      sender_role = req.session.user.role;
                                    }
                                    
                                    Req_update.saveModel(req_id, recv_id, sender_id, sender_role, role, msg_title, msg_content);
                                  }
                                });
                  

                });
                // defining variables to be saved in the update_requests database
                
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
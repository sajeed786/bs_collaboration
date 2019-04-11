var mongoose = require('mongoose');

var NreqSchema = mongoose.Schema({
    sender_name:{
        type: String,
        index: true
    },
    receiver_list: {
        type: Array
    },
    message_title: {
        type: String
    },
    message_content: {
        type: String
    },
    send_date: {
        type: Date,
        default: Date.now
    }
});

var Nreq = module.exports = mongoose.model('Nreq',NreqSchema);

module.exports.createRequest = function(newRequest, callback){
    newRequest.save(callback);
}
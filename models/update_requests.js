var mongoose = require('mongoose');

var Req_updateSchema = mongoose.Schema({
    req_id: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Nreq'
    },

    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'User'
    },

    data_exchange: [
        {
            sender_id: {
                type: mongoose.Schema.Types.ObjectId,
                Ref: 'User'
            },

            sender_role: {
                type: String,
                Ref: 'User'
            },

            receiver_id: {
                type: mongoose.Schema.Types.ObjectId,
                Ref: 'User'
            },

            receiver_role: {
                type: String,
                Ref: 'User'
            },

            message_sub: String,

            message_content: String,

            time_exc: {
                type: Date,
                //default: Date.now
            },
            seen: {
                type: Boolean,
                default: false
            }

        }
    ]
});

var Req_update = module.exports = mongoose.model('Req_update', Req_updateSchema);

module.exports.saveModel = function(req_id, recv_id, sender_id, sender_role, role, msg_title, msg_content){
    
    for(var i = 0; i<3; i++)
    {
        var save_time = new Date(Date.now());
        var update = new Req_update({
            req_id: req_id,
            supplier_id: recv_id[i],
            data_exchange: [
                {
                    sender_id: sender_id,
                    sender_role: sender_role,
                    receiver_id: recv_id[i],
                    receiver_role: role,
                    message_sub: msg_title,
                    message_content: msg_content,
                    time_exc: save_time.toLocaleString()
                }
            ]
        });

        update.save(function(err, requpdate){
            if(err) throw err;

            console.log(requpdate);
        });
    }
}


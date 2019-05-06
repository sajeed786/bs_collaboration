var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

 

//User Schema

var UserSchema = mongoose.Schema({

                username: {

                                type: String,

                                index: true

                },

                name: {

                                type: String

                },

                email: {

                                type: String

                },

                company: {

                                type: String

                },

                role: {
                                type: String
                },

                password: {

                                type: String

                },

                last_login_date: {
                                type: Date,
                                default: Date.now
                }
 
});

UserSchema.statics.login = function login(id, callback) {
    return this.findByIdAndUpdate(id, { $set : { 'last_login_date' : new Date(Date.now()),  new: true }}, callback);
 };

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){

                bcrypt.genSalt(10, function(err, salt) {

    bcrypt.hash(newUser.password, salt, function(err, hash) {

                               newUser.password = hash;
                               //newUser.last_login_date = (new Date(Date.now())).toLocaleString();

                               newUser.save(callback);

    });

});

}

 

module.exports.getUserByUsername = function(username, callback){

                var query = {username: username};

                User.findOne(query, callback);

}

 

module.exports.getUserById = function(id, callback){

                User.findById(id, callback);

}


module.exports.getUserByCompany = function(recv, recv_id, role, callback){
    var query = {company:recv, role:role};
    User.findOne(query, function(err, user){
        if(err){
            callback(err);
            return;
        }
        else{
            if(user){
                recv_id.push(user._id);
                callback(null);
            }
            else{
                console.log("user not found");
            }
        }
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){

               // console.log(candidatePassword + " " + hash);

                bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

                                if(err) throw err;

                                callback(null, isMatch);

                });

}
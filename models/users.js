/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var applications = require('./applications');

var userSchema = new Schema({
    username        : { type: String, required: true, unique: true },
    password        : { type: String, required: true },
    email           : String,
    picture         : { type: String, default : "http://www.outsystems.com/PortalTheme/img/UserImage.png?23465" },
    applications    : [{ type: ObjectId, ref: 'applications'}],
    admin           : { type: Boolean, default: false},
    created_at      : Date,
    updated_at      : Date
});

userSchema.pre('save', true, function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    var self = this;
    mongoose.models["users"].findOne({username : self.username},function(err, results) {
         if(results) { //there was a result found, so the email address exists
            self.invalidate("username","username must be unique");
            var error = new Error();
            error.message = "Username already existing. Please try another.";
            error.status = 409;
            done(error);
        } else if(err) {
            done(err);
        }  else {
            done();
        }
    });
    next();
});

var User = mongoose.model('users', userSchema);

module.exports = User;
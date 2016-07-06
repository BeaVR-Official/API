/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var applications = require('./applications');

var userSchema = new Schema({
    pseudo          : { type: String, required: true, unique: true, default:"" },
    password        : { type: String, required: true, default: "" },
    lastName        : { type: String, default: ""},
    firstName       : { type: String, default: ""},
    email           : { type: String, default: ""},
    picture         : { type: String, default : "http://www.outsystems.com/PortalTheme/img/UserImage.png?23465" },
    applications    : [{ type: ObjectId, ref: 'applications'}],
    admin           : { type: Boolean, default: false},
    public          : {
        pseudo      : String,
        email       : String,
        picture     : String,
        created_at  : String
    },
    created_at      : Date,
    updated_at      : Date
});

userSchema.pre('save', true, function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    this.public.pseudo = this.pseudo;
    this.public.email = this.email;
    this.public.picture = this.picture;
    this.public.created_at = this.created_at;
    var self = this;
    mongoose.models["users"].findOne({username : self.username},function(err, results) {
         if(results._id.id != self._id.id) { //there was a result found, so the email address exists
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
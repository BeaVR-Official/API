/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
    pseudo          : { type: String, required: true, unique: true, default:"" },
    password        : { type: String, required: true, default: "" },
    lastName        : { type: String, default: ""},
    firstName       : { type: String, default: ""},
    email           : { type: String, default: ""},
    picture         : { type: String, default : "http://www.outsystems.com/PortalTheme/img/UserImage.png?23465" },
    applications    : [{ type: ObjectId, ref: 'applications'}],
    progressions    : [{
        application : { type: ObjectId, ref: 'applications'},
        progression : { type: Number, default: 0}
    }],
    admin           : { type: Boolean, default: false},
    public          : {
        pseudo      : String,
        email       : String,
        picture     : String,
        created_at  : String
    },
    google          : {
        id          : String,
        token       : String,
        name        : String,
        email       : String
    },
    facebook        : {
        id          : String,
        token       : String,
        lastname    : String,
        firstname   : String,
        email       : String,
        gender      : String,
        facebookurl : String
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
    mongoose.models["users"].findOne({pseudo : self.pseudo},function(err, results) {
        if (err) return done(err);
        else if(results != null && results._id.id != self._id.id) { //there was a result found, so the email address exists
            self.invalidate("username", "username must be unique");
            var error = new Error();
            error.message = "Username already existing. Please try another.";
            error.status = 409;
            done(error);
        }
         else {
            done();
        }
    });
    next();
});

var User = mongoose.model('users', userSchema);

module.exports = User;
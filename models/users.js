/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
    id              : {type : String, unique: true },
    pseudo          : { type: String, required: true, unique: true, default:"" },
    password        : { type: String, required: true, default: "" },
    lastName        : { type: String, default: ""},
    firstName       : { type: String, default: ""},
    email           : { type: String, default: "", unique: true},
    picture         : { type: String, default : "http://www.outsystems.com/PortalTheme/img/UserImage.png?23465" },
    applications    : [{ type: ObjectId, ref: 'applications'}],
    purchase        : [{ type: ObjectId, ref: 'purchases'}],
    progressions    : [{
        application : { type: ObjectId, ref: 'applications'},
        progression : { type: Number, default: 0}
    }],
    admin           : { type: Boolean, default: false},
    rights           : { type: ObjectId, ref: 'rights', default: "57a3609edfc0aa2381bde52e"},
    public          : {
        pseudo      : String,
        picture     : String,
        applications: [{ type: ObjectId, ref: 'applications'}],
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
    projects         : [{type: ObjectId, ref: 'projects'}],
    token           : String,
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
    this.public.created_at = this.created_at;
    this.public.applications = this.applications;
    this.id = this._id.toHexString();
    var self = this;
    mongoose.models["users"].findOne({pseudo : self.pseudo},function(err, results) {
        if (err) return done(err);
        else if(results != null && results._id.id != self._id.id) { //there was a result found, so the email address exists
            self.invalidate("pseudo", "username must be unique");
            var error = new Error();
            error.message = "Pseudo already existing. Please try another.";
            error.status = 409;
            done(error);
        }
         else {
            mongoose.models["users"].findOne({email : self.email},function(err, results) {
                if (err) return done(err);
                else if (results != null && results._id.id != self._id.id) {
                    self.invalidate("email", "email must be unique");
                    var error = new Error();
                    error.message = "Email already existing. Please try another.";
                    error.status = 409;
                    done(error);
                }
                else {
                    done();
                }
            });
        }
    });
    next();
});

var User = mongoose.model('users', userSchema);

module.exports = User;
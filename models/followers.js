/**
 * Created by kersal_e on 02/08/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var followersShema = new Schema({
    id              : {type : String, unique: true },
    email           : { type: String, default: ""},
    firstname       : { type: String, default: ""},
    lastname        : { type: String, default: ""},
    created_at      : Date,
    updated_at      : Date
});

followersShema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    this.id = this._id.toHexString();
    next();
});

var Followers = mongoose.model('followers', followersShema);

module.exports = Followers;
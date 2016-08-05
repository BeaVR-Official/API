/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var commentsSchema = new Schema({
    id              : {type : String, unique: true },
    title           : { type: String, required: true },
    comment         : { type: String, required: true },
    rating          : { type: Number, min: 0, max: 5, default: 0},
    author          : { type: ObjectId, required: true, ref: 'users' },
    application     : { type: ObjectId, required: true, ref: 'applications'},
    created_at      : Date,
    updated_at      : Date
});

commentsSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    this.id = this._id.toHexString();
    if (this.title == undefined || this.title == "") {
        var error = new Error();
        error.message = "Title field cannot be empty.";
        error.status = 400;
        next(error);
    }
    next();
});

commentsSchema.plugin(timestamps);


var comments = mongoose.model('comments', commentsSchema);

module.exports = comments;
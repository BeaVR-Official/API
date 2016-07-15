/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var commentsSchema = new Schema({
    id              : {type : String, unique: true },
    title           : { type: String, required: true },
    comment         : { type: String, required: true },
    rating          : Number,
    author          : { type: ObjectId, required: true, ref: 'users' },
    application     : { type: ObjectId, required: true, ref: 'applications'},
    created_at      : Date,
    updated_at      : Date
});

commentsSchema.pre('save', true, function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    this.id = this._id.toHexString();
    if (this.title == undefined || this.title == "") {
        var error = new Error();
        error.message = "Title field cannot be empty.";
        error.status = 400;
        done(error);
    }
    next();
});



var comments = mongoose.model('comments', commentsSchema);

module.exports = comments;
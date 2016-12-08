/**
 * Created by ekersale on 08/12/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fsextra = require("fs.extra");
var ObjectId = Schema.Types.ObjectId;
var fs = require('fs');


var filesShema = new Schema({
    author          : { type: ObjectId, required: true, ref: 'users' },
    relativePath    : String,
    absolutePath    : String,
    filename        : String,
    created_at      : Date,
    updated_at      : Date
});

filesShema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

filesShema.pre('remove', function(next) {
    if (fs.existsSync(this.absolutePath)) {
        fsextra.rmrfSync(this.absolutePath);
    }
    next();
});


var Files = mongoose.model('files', filesShema);

module.exports = Files;
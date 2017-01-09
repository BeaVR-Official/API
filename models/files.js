/**
 * Created by ekersale on 08/12/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fsextra = require("fs.extra");
var ObjectId = Schema.Types.ObjectId;
var fs = require('fs');
var Saves = require('./save');

var filesShema = new Schema({
    author          : { type: ObjectId, required: true, ref: 'users' },
    relativePath    : String,
    absolutePath    : String,
    filename        : String,
    saves            : {type:ObjectId, ref:'saves'},
    created_at      : Date,
    updated_at      : Date
});

filesShema.pre('save', function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    fsextra.move('/home/API/uploads/temp/' + this.filename, this.absolutePath, function(err) {
        if (err) done(err);
    });
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

filesShema.pre('remove', function(next) {
    if (fs.existsSync(this.absolutePath)) {
        fsextra.rmrfSync(this.absolutePath);
    }
    var that = this;
    Saves.findOne({_id: that.saves}, function(err, ss) {
        if (err || !ss) return;
        else {
            var index = ss.files.indexOf(that._id);
            if (index >= 0) ss.files.splice(index, 1);
            ss.save(function(){return next();});
        }
    })
});

filesShema.post('remove', function() {
    if (fs.existsSync(this.absolutePath)) {
        fsextra.rmrfSync(this.absolutePath);
    }
    var that = this;
    Saves.findOne({_id: that.saves}, function(err, ss) {
        if (err || !ss) return;
        else {
            var index = ss.files.indexOf(that._id);
            if (index >= 0) ss.files.splice(index, 1);
            ss.save(function(){return;});
        }
    })
});



var Files = mongoose.model('files', filesShema);

module.exports = Files;
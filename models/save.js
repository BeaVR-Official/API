/**
 * Created by ekersale on 08/12/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var fsextra = require("fs.extra");
var fs = require('fs');
var Projects = require('./projects');

var saveShema = new Schema({
    author          : { type: ObjectId, required: true, ref: 'users' },
    files           : [{ type: ObjectId, required: true, ref: 'files' }],
    project         : {type: ObjectId, require: true, ref: 'projects'},
    sceneDescriptors: [],
    startingSceneUuid: {type: String, default: undefined},
    name            : {type: String, default: Date},
    created_at      : Date,
    updated_at      : Date
});

saveShema.pre('save', function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    if (this.isNew) {
        var repos = '/home/API/uploads/creator/' + this.author + "/" + this.project + "/" + this._id;
        if (!fs.existsSync(repos)){
            fs.mkdirSync(repos);
        }
        var that = this;
        Projects.findOne({_id: that.project }, function(err, pj) {
            if (err || !pj)
            {
                that.invalidate("project", "correct project must be specify");
                var error = new Error();
                error.message = "Project not found. Please try another project.";
                error.status = 404;
                return done(err || error);
            }
            else {
                pj.saves.push(that._id);
                pj.save(function(err) {
                    if (err) return done(err);
                    else return next();
                });
            }
        })
    }
    next();
});


saveShema.pre('remove', function(next) {
    var path = '/home/API/uploads/creator/' + this.author + "/" + this.project + "/" + this._id;
    if (fs.existsSync(path)) {
        fsextra.rmrfSync(path);
    }
    var that = this;
    Projects.findOne({_id: that.project}, function(err, pj) {
        if (err || !pj) return;
        else {
            var index = pj.saves.indexOf(that._id);
            if (index >= 0) pj.saves.splice(index, 1);
            pj.save(function(){next();});
        }
    })
});

saveShema.post('remove', function() {
    var path = '/home/API/uploads/creator/' + this.author + "/" + this.project + "/" + this._id;
    if (fs.existsSync(path)) {
        fsextra.rmrfSync(path);
    }
    var that = this;
    Projects.findOne({_id: that.project}, function(err, pj) {
        if (err || !pj) return;
        else {
            var index = pj.saves.indexOf(that._id);
            if (index >= 0) pj.saves.splice(index, 1);
            pj.save(function(){return});
        }
    })
});


var Saves = mongoose.model('saves', saveShema);

module.exports = Saves;
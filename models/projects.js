/**
 * Created by kersal_e on 10/09/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var fsextra = require("fs.extra");
var fs = require('fs');
var Users = require('./users');
var Saves = require('./save');


var projectsShema = new Schema({
    name            : String,
    author          : {type: ObjectId, ref:"users"},
    description     : {type: String},
    exported        : {type: Boolean, default: false},
    saves           : [{type: ObjectId, ref:"saves"}],
    created_at      : Date,
    updated_at      : Date
});

projectsShema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    if (this.isNew) {
        var repos = __dirname + '/uploads/creator/' + user._id + "/" + project._id;
        if (!fs.existsSync(repos)){
            fs.mkdirSync(repos);
        }
        Users.findOne({_id: this.author}, function(err, user) {
            if (err) return next(err);
            else if (!user) return next(req.app.getError(404, "User not found"));
            else {
                user.projects.push(this._id);
                user.save(function(err) {
                    return (err) ? next(err) : next();
                });
            }
        });
    }
    else
        next();
});

projectsShema.pre('remove', function(next) {
    var path = __dirname + "/uploads/creator/" + this.author + "/" + this._id;
    if (fs.existsSync(path)) {
        fsextra.rmrfSync(path);
    }
    next();
});



var Projects = mongoose.model('projects', projectsShema);

module.exports = Projects;
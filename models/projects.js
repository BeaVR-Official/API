/**
 * Created by kersal_e on 10/09/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var fsextra = require("fs.extra");
var fs = require('fs');
var Users = require('./users');
var Projects = require('./projects');

var projectsShema = new Schema({
    name            : {type:String},
    author          : {type: ObjectId, ref:"users"},
    description     : {type: String},
    exported        : {type: Boolean, default: false},
    saves           : [{type: ObjectId, ref:"saves"}],
    created_at      : Date,
    updated_at      : Date
});

projectsShema.pre('save', function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    if (this.isNew) {
        var repos = '/home/API/uploads/creator/' + this.author + "/" + this._id;
        if (!fs.existsSync('/home/API/uploads/creator/' + this.author)) {
            fs.mkdirSync('/home/API/uploads/creator/' + this.author)
        }
        if (!fs.existsSync(repos)){
            fs.mkdirSync(repos);
        }
        var that = this;
        Projects.findOne({name : that.name},function(err, results) {
            if (err) {
                console.log("coucou 1");
                return done(err);
            }
            else if(results != null && results._id != that._id) { //there was a result found, so the email address exists
                that.invalidate("project name", "project name must be unique");
                var error = new Error();
                error.message = "Project already existing. Please try another name.";
                error.status = 409;
                return done(error);
            }
            else {
                Users.findOne({_id: that.author}, function(err, user) {
                    if (err) return done(err);
                    else if (!user) {
                        that.invalidate("author", "author unknown");
                        var error = new Error();
                        error.message = "User not found";
                        error.status = 404;
                        return done(error);
                    }
                    else {
                        user.projects.push(that._id);
                        user.save(function(err) {
                            return (err) ? done(err) : next();
                        });
                    }
                });
            }
        });
    }
    else
        next();
});

projectsShema.pre('remove', function(next) {
    var path = "/home/API//uploads/creator/" + this.author + "/" + this._id;
    if (fs.existsSync(path)) {
        fsextra.rmrfSync(path);
    }
    var that = this;
    Users.findOne({_id: that.author}, function(err, user) {
        if (err || !user) return;
        else {
            var index = user.projects.indexOf(that._id);
            if (index >= 0) user.projects.splice(index, 1);
            user.save(function(){next();});
        }
    })
});

projectsShema.post('remove', function() {
    var path = "/home/API//uploads/creator/" + this.author + "/" + this._id;
    if (fs.existsSync(path)) {
        fsextra.rmrfSync(path);
    }
    var that = this;
    Users.findOne({_id: that.author}, function(err, user) {
        if (err || !user) return;
        else {
            var index = user.projects.indexOf(that._id);
            if (index >= 0) user.projects.splice(index, 1);
            user.save(function(){return;});
        }
    })
});


var Projects = mongoose.model('projects', projectsShema);

module.exports = Projects;
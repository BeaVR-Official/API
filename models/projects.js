/**
 * Created by kersal_e on 10/09/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var projectsShema = new Schema({
    name            : String,
    author          : {type: ObjectId, ref:"users"},
    sources         : {type: String, unique: true},
    exported        : {type: Boolean, default: false},
    created_at      : Date,
    updated_at      : Date
});

projectsShema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

var Projects = mongoose.model('projects', projectsShema);

module.exports = Projects;
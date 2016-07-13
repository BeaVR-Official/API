/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var applicationsSchema = new Schema({
    name            : { type: String, required: true, unique: true },
    description     : { type: String, required: true },
    logo            : String,
    url             : String,
    categoriesName  : [{ type: ObjectId, ref: 'categories'}],
    devicesNames    : [{ type: ObjectId, ref : 'devices'}],
    price           : { type: Number, required: true, min: 0, max: 99, default: 0},
    author          : {type: ObjectId, ref: 'users', required: true},
    created_at      : Date,
    updated_at      : Date
});

applicationsSchema.pre('save', true, function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    var self = this;
    mongoose.models["applications"].findOne({name : self.name},function(err, results) {
        if(results) { //there was a result found, so the email address exists
            self.invalidate("name","name must be unique");
            var error = new Error();
            error.message = "Application name already existing. Please try another.";
            error.status = 409;
            done(error);
        } else if(err) {
            done(err);
        }  else {
            done();
        }
    });
    next();
});


var applications = mongoose.model('applications', applicationsSchema);

module.exports = applications;
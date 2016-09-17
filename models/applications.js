/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var applicationsSchema = new Schema({
    id              : {type : String, unique: true },
    name            : { type: String, required: true, unique: true },
    description     : { type: String, required: true },
    logo            : {type: String},
    screenshots     : [{type: String}],
    url             : String,
    categoriesName  : [{ type: ObjectId, ref: 'categories'}],
    devicesName     : [{ type: ObjectId, ref : 'devices'}],
    price           : { type: Number, required: true, min: 0, max: 99, default: 0},
    author          : {type: ObjectId, ref: 'users', required: true},
    noteAvg         : {type: Number, default: 0},
    commentsNb      : {type: Number, default: 0},
    created_at      : Date,
    updated_at      : Date
});

applicationsSchema.pre('save', true, function(next, done) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    if (this._id != undefined)
        this.id = this._id.toHexString();
    var self = this;
    mongoose.models["applications"].findOne({name : self.name},function(err, results) {
        if(results && results._id.id != self._id.id) { //there was a result found, so the email address exists
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
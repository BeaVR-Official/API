/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var devicesSchema = new Schema({
    name            : { type: String, required: true, unique: true },
    image           : String
});

devicesSchema.pre('save', true, function(next, done) {
    var self = this;
    mongoose.models["applications"].findOne({name : self.name},function(err, results) {
        if(results) { //there was a result found, so the email address exists
            self.invalidate("name","Device name must be unique");
            var error = new Error();
            error.message = "Device name already existing. Please try another.";
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

var devices = mongoose.model('devices', devicesSchema);

module.exports = devices;
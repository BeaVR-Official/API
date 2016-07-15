/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriesSchema = new Schema({
    id              : {type : String, unique: true },
    name            : { type: String, required: true, unique: true },
    description     : { type: String, required: true }
});

categoriesSchema.pre('save', true, function(next, done) {
    var self = this;
    this.id = this._id.toHexString();
    mongoose.models["applications"].findOne({name : self.name},function(err, results) {
        if(results) { //there was a result found, so the email address exists
            self.invalidate("name","Category name must be unique");
            var error = new Error();
            error.message = "Category name already existing. Please try another.";
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

var categories = mongoose.model('categories', categoriesSchema);

module.exports = categories;
/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoryFieldSchema = new Schema({
    description     : { type: String, required: true }
});

categoryFieldSchema.pre('save', true, function(next, done) {
    if (this.name == undefined || this.name == "") {
        var error = new Error();
        error.message = "Category field cannot be empty.";
        error.status = 400;
        done(error);
    }
    next();
});

var categoryField = mongoose.model('categoryField', categoryFieldSchema);

module.exports = categoryField;
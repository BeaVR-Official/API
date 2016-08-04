/**
 * Created by kersal_e on 07/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var ValidationSchema = new Schema({
    id              : {type : String, unique: true },
    type                : { type: String, required: true},
    application         : {
        name            : { type: String, required: true, unique: true },
        description     : { type: String, required: true },
        logo            : [{ type:String }],
        url             : String,
        categoriesName  : [{ type: ObjectId, ref: 'categories'}],
        devicesNames    : [{ type: ObjectId, ref : 'devices'}],
        author          : {type: ObjectId, ref: 'users', required: true},
        price           : {type: Number, required: true}
    },
    device              : {
        name            : { type: String, required: true, unique: true },
        image           : String
    },
    categorie           : {
        name            : { type: String, required: true, unique: true },
        description     : { type: String, required: true }
    },
    created_at          : Date,
    updated_at          : Date
});

ValidationSchema.pre('save',function(next) {
    var currentDate = new Date();
    this.id = this._id.toHexString();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});



var validation = mongoose.model('validation', ValidationSchema);

module.exports = validation;
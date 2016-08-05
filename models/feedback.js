/**
 * Created by kersal_e on 05/07/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var feedbackSchema = new Schema({
    id          : { type : String, unique: true },
    user        : { type: ObjectId, required: true, ref : 'users' },
    object      : { type: String, required: true },
    description : { type: String, required: true},
    recontact   : { type: Boolean, default: false},
    created_at  : Date,
    updated_at  : Date

});

feedbackSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.id = this._id.toHexString();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});


var Feedbacks = mongoose.model('feedbacks', feedbackSchema);

module.exports = Feedbacks;
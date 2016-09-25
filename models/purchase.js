/**
 * Created by kersal_e on 02/09/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var purchaseShema = new Schema({
    application     : { type: ObjectId, required: true, ref : 'applications' },
    payment         : {type: String},
    amount          : {type: Number, default: 0},
    transactionId   : {type: String},
    created_at      : Date,
    updated_at      : Date
});

purchaseShema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

var Purchase = mongoose.model('purchases', purchaseShema);

module.exports = Purchase;
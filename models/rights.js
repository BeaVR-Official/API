/**
 * Created by kersal_e on 04/08/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rightsShema = new Schema({
    id              : {type : Number, unique: true },
    name            : String
});

var Rights = mongoose.model('rights', rightsShema);

module.exports = Rights;
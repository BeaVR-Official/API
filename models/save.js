/**
 * Created by ekersale on 08/12/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var saveShema = new Schema({
    author          : { type: ObjectId, required: true, ref: 'users' },
    files           : [{ type: ObjectId, required: true, ref: 'files' }],
    project         : {type: ObjectId, require: true, ref: 'projects'},
    name            : {type: String, default: Date.toString()},
    created_at      : Date,
    updated_at      : Date
});

saveShema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    if (this.isNew) {
        var repos = __dirname + '/uploads/creator/' + this.author._id + "/" + this.project._id + "/" + this._id;
        if (!fs.existsSync(repos)){
            fs.mkdirSync(repos);
        }
    }
    next();
});


saveShema.pre('remove', function(next) {
    var path = __dirname + '/uploads/creator/' + this.author._id + "/" + this.project._id + "/" + this._id;
    if (fs.existsSync(path)) {
        fsextra.rmrfSync(path);
    }
    next();
});


var Saves = mongoose.model('saves', saveShema);

module.exports = Saves;
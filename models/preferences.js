var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

var prefSchema = new Schema({
    preftype: {type:String, required:true},
	sitename: {type:String, required: true},
    sitetag: {type:String, required: false},
    copyright: {type:String, required:true},
    do_key: {type:String, required: true}
});

module.exports = mongoose.model('Preference', prefSchema);


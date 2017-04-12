var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var regionSchema = new Schema({
	name: {type: String, required: true},
    slug: {type: String, required: true},
	size: [String],
	feature: [String],
	available: {type: Boolean, required: true}
});

module.exports.clearDB = function(){

}
module.exports = mongoose.model('HostRegion', regionSchema);
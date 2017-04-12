var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var imageSchema = new Schema({
	name: {type: String, required: true},
    distribution: {type: String, required: true},
    slug: {type: String, required:true},
	public: {type: Boolean, required: true},
    regions: [String],
    created: {type: String, required: true},
    min_disk_size: {type: Number, required: true},
    type: {type:String, required:true},
    size_gigabytes: {type:Number, required: true}
});

module.exports = mongoose.model('HostImage', imageSchema);
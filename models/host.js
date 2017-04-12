var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var hostSchema = new Schema({
	dropid: {type: Number, required: true},
	user: { type: Schema.Types.ObjectId, ref: 'User'},
	name: {type: String, required: true},
	memory: {type: Number, required: true},
	vcpus: {type: Number, required: true},
	disk: {type: Number, required: true},
	locked: {type: Boolean, required: true},
	status: {type: String, required: true},
	kernel: {type: String},
	created: {type: String, required: true},
	features: [String],
	backup_ids: [Number],
	next_backup_window: {type:String},
	snapshot_ids: [Number],
	image: {type: Schema.Types.ObjectId, ref: 'HostImage'},
	volume_ids: [Number],
    size: {type: Schema.Types.ObjectId, ref: 'HostSize'},
	size_slug: {type: String, required: true},
	networks: {v4:[Number], v6:[Number]},
	region: {type: Schema.Types.ObjectId, ref: 'HostRegion'},
	tags: [String]
});

hostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Host', hostSchema);
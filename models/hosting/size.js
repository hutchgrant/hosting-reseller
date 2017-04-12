var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var sizeSchema = new Schema({
	slug: {type: String, required: true},
    memory: {type: Number, required: true},
    vcpus: {type: Number, required:true},
    disk:  {type: Number, required:true},
    transfer: {type: Number, required:true},
    price_monthly: {type: Number, required:true},
    price_hourly: {type: Number, required:true},
    regions: [String],
	available: {type: Boolean, required: true}
});

module.exports = mongoose.model('HostSize', sizeSchema);
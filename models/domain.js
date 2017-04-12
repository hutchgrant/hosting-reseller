var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var schema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User'},
	url: {type: String, required: true},
	created: {type: String, required: true},
	expiration: {type: String, required: true}
});

module.exports = mongoose.model('Domain', schema);
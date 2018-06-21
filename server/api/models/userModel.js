// init vars and modules
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Create a new schema for the user data.
 * @type {mongoose.Schema}
 */
var schema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

exports.schema = mongoose.model('Users', schema);

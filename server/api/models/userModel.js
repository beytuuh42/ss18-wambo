// init vars and modules
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

/**
 * Create a new schema for the user data.
 * @type {mongoose.Schema}
 */
var schema = new Schema({
    username: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true},
    admin : {type:Boolean, required:true, default:false}
});

/**
 * Hashing password for obvious reasons.
 * @param password input string
 * @returns {*}
 */
var encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
};

/**
 * Comparing passwords.
 * @param password input string
 * @returns {*}
 */
schema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

exports.schema = mongoose.model('Users', schema);
exports.encryptPassword = encryptPassword;

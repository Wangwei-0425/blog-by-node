let mongoose = require('mongoose');
let UserSchema = require('../schemas/users');

module.exports = mongoose.model('User',UserSchema);
let mongoose = require('mongoose');
let CategoryName = require('../schemas/categories');

module.exports = mongoose.model('Category',CategoryName);
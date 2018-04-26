let mongoose = require('mongoose');
let schema = mongoose.Schema;

module.exports = new schema({

    category: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'

    },

    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },

    time: {

        type: Date,
        default: Date.now()

    },

    views: {

        type: Number,
        default: 0

    },

    comment: {

        type: Array,
        default: []

    },

    title: String,

    about: {
        type: String,
        default: ''
    },

    contents: {
        type: String,
        default: ''
    }

});
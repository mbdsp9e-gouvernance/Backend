const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tenderSchema = new Schema({
    ref: String,
    title: String,
    description: String,
    critere: Array,
    dateEmission: Date,
    dateLimit: Date,
    tenderStatus: Number
}, {collection: 'tender'})

module.exports = mongoose.model('tender', tenderSchema);
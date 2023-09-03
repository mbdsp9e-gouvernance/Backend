const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const soumissionSchema = new Schema({
    society: Object,
    dateSoumission: Date,
    tender: Object,
    status: Number,
}, {collection: 'soumission'});

module.exports = mongoose.model("soumission", soumissionSchema);

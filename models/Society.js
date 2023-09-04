const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const societySchema = new Schema({
  name: String,
  nif: String,
  stat: String,
  password: String,
}, {collection: 'society'});

module.exports = mongoose.model("society", societySchema);

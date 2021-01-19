const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const tradesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(STRINGS.MODALS.TRADES, tradesSchema);

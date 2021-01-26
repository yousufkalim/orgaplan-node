const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const companyTradesSchema = new Schema({
  trades: [{ type: Schema.Types.ObjectId, ref: STRINGS.MODALS.TRADES }],
  siteId: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.SITE },
  companyId: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.COMPANY },
});

module.exports = mongoose.model(
  STRINGS.MODALS.COMPANYTRADES,
  companyTradesSchema
);

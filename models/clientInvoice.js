const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const clientInvoiceSchema = new Schema({
  price: { type: Number, default: 0 },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: STRINGS.MODALS.USER,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: STRINGS.MODALS.CLIENT,
  },
  siteId: {
    type: Schema.Types.ObjectId,
    ref: STRINGS.MODALS.SITE,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: [STRINGS.STATUS.PAID, STRINGS.STATUS.UNPAID],
    default: STRINGS.STATUS.PAID,
  },
});

module.exports = mongoose.model(
  STRINGS.MODALS.CLIENTINVOICE,
  clientInvoiceSchema
);

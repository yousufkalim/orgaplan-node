const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const invoiceSchema = new Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
    enum: [STRINGS.STATUS.PAID, STRINGS.STATUS.UNPAID],
    default: STRINGS.STATUS.PAID,
  },
  invoiceType: {
    type: String,
    enum: [
      STRINGS.INVOICETYPES.DELAY,
      STRINGS.INVOICETYPES.INCIDENT,
      STRINGS.INVOICETYPES.UNPLANNEDDELIVERY,
      STRINGS.INVOICETYPES.WAYS,
    ],
    default: STRINGS.INVOICETYPES.DELAY,
  },
  information: [
    {
      name: { type: String },
      images: [{ type: String }],
      site: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.SITE,
      },
      enterprise: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.USER,
      },
      comments: [
        {
          comment: String,
          userId: {
            type: Schema.Types.ObjectId,
            ref: STRINGS.MODALS.USER,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model(STRINGS.MODALS.INVOICE, invoiceSchema);

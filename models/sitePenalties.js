const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const sitePenaltiesScheme = new Schema({
  lateCost: {
    type: Number,
    required: true,
  },
  unexptectedCost: {
    type: Number,
    required: true,
  },

  siteId: {
    type: Schema.Types.ObjectId,
    ref: STRINGS.MODALS.SITE,
    required: true,
  },
  companies: [
    {
      companyId: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.COMPANY,
      },
      typeOfPenalty: {
        type: String,
        enum: [STRINGS.SITEPENALTY.LATE, STRINGS.SITEPENALTY.UNEXPRECTED],
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model(
  STRINGS.MODALS.SITEPENALTIES,
  sitePenaltiesScheme
);

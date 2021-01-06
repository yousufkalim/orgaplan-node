const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const deliveryArea = new Schema(
  {
    name: String,
    start: Date,
    end: Date,
    means: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MEAN,
      },
    ],
    status: {
      type: String,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
    unavailable: {
      reason: String,
      start: Date,
      end: Date,
      siteId: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.SITE,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.DELIVERYAREA, deliveryArea);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const deliveryArea = new Schema(
  {
    name: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
    unavailable: {
      reason: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
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

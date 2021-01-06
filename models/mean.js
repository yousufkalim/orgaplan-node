const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const meanSchema = new Schema(
  {
    name: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.UNAVAILABLE,
        STRINGS.STATUS.INACTIVE,
        STRINGS.STATUS.COMPLETED,
      ],
    },
    statusReason: {
      type: String,
    },
    pricePerHour: {
      type: Number,
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
    },

    availability: {
      reason: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.MEAN, meanSchema);

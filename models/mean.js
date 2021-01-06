const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const meanSchema = new Schema(
  {
    name: String,
    description: String,
    sheet: String,
    pricePerHour: Number,
    meanType: {
      type: String,
      enum: [STRINGS.MEANTYPES.LIFTING, STRINGS.MEANTYPES.ROUTING],
    },
    status: {
      type: String,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
    availability: [
      {
        start: Date,
        end: Date,
      },
    ],
    unavailable: [
      {
        reason: String,
        start: Date,
        end: Date,
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.MEAN, meanSchema);

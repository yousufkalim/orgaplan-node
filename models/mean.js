const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const meanSchema = new Schema(
  {
    name: String,
    sheet: String,
    pricePerHour: Number,
    additionalInfo: String,
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    meanType: {
      type: String,
      enum: [STRINGS.MEANTYPES.LIFTING, STRINGS.MEANTYPES.ROUTING],
    },
    status: {
      type: String,
      default: STRINGS.STATUS.AVAILABLE,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
    picCoordinates: {
      x: Number,
      y: Number,
    },
    location: [
      {
        deliveryArea: {
          type: Schema.Types.ObjectId,
          ref: STRINGS.MODALS.DELIVERYAREA,
        },
        storageArea: {
          type: Schema.Types.ObjectId,
          ref: STRINGS.MODALS.STORAGEAREA,
        },
      },
    ],
    availability: {
      start: Date,
      end: Date,
    },
    unavailability: [
      { date: Date, reason: String, startingHour: Number, endingHour: Number },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.MEAN, meanSchema);

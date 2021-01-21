const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");
const randomColor = require("../utils/colorGenerator");
const deliveryArea = new Schema(
  {
    name: String,
    document: String,
    addresses: [{ lat: Number, long: Number }],
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
    unavailability: [
      { date: Date, reason: String, startingHour: Number, endingHour: Number },
    ],
    color: {
      type: String,
      default: randomColor,
    },
    availability: {
      start: Date,
      end: Date,
    },
    vehicles: [{ name: String }],
    picCoordinates: {
      x: { type: Number },
      y: { type: Number },
    },

    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    deliveryAreaEndNotificaionTime: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.DELIVERYAREA, deliveryArea);

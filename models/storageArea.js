const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const storageArea = new Schema(
  {
    name: String,
    level: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.LEVEL,
    },
    location: {
      type: String,
      enum: [STRINGS.STATUS.INSIDE, STRINGS.STATUS.OUTSIDE],
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    unavailabilityDates: [
      {
        date: Date,
        startHour: Number,
        endHour: Number,
        dayOff: { type: Boolean, default: false },
        reason: String,
      },
    ],
    availability: {
      start: Date,
      end: Date,
    },
    deliveryArea: [
      { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.DELIVERYAREA },
    ],
    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.COMPANY,
      },
    ],
    materials: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MATERIAL,
      },
    ],
    means: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MEAN,
      },
    ],
    notificationPriorToDays: Number,
    notificationTo: [{ type: String }],
    status: {
      type: String,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    picCoordinates: {
      x: { type: Number },
      y: { type: Number },
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.STORAGEAREA, storageArea);

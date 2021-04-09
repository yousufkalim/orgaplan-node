const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const storageArea = new Schema(
  {
    name: String,
    isFull: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      enum: [STRINGS.STATUS.INSIDE, STRINGS.STATUS.OUTSIDE],
      default: STRINGS.STATUS.INSIDE,
    },
    availability: {
      start: Date,
      end: Date,
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
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    level: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.LEVEL,
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
    materials: [{ type: String }],
    notificationPriorToDays: Number,
    notificationTo: [{ type: String }],
    status: {
      type: String,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.STORAGEAREA, storageArea);

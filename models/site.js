const mongoose = require("mongoose");
const { number } = require("joi");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const siteSchema = new Schema(
  {
    name: String,
    logo: String,
    start: Date,
    end: Date,
    openingHour: Number,
    closingHour: Number,
    siteEndAlertTime: Number,
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.UNAVAILABLE,
        STRINGS.STATUS.INACTIVE,
        STRINGS.STATUS.COMPLETED,
      ],
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
    additionalInfo: String,
    unAvailabilityDates: [{ type: Date }],
    unavailabilityReason: String,
    means: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MEAN,
      },
    ],
    trades: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.TRADES,
      },
    ],
    buildings: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.BUILDING,
      },
    ],
    addresses: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.SITE, siteSchema);

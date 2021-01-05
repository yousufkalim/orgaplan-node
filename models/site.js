const mongoose = require("mongoose");
const { number } = require("joi");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const siteSchema = new Schema(
  {
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    openingHour: {
      type: Number,
    },
    closingHour: {
      type: Number,
    },
    siteEndAlertTime: {
      type: Number,
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
    unavailabilityReason: {
      type: String,
      required: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
    location: {
      buildingIds: [
        {
          type: Schema.Types.ObjectId,
          ref: STRINGS.MODALS.BUILDING,
          required: false,
        },
      ],
      levelIds: [
        {
          type: Schema.Types.ObjectId,
          ref: STRINGS.MODALS.LEVEL,
          require: false,
        },
      ],
    },
    addresses: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.SITE, siteSchema);

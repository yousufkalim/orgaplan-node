const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const storageArea = new Schema(
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.STORAGEAREA, storageArea);

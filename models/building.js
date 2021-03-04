const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const buildingSchema = new Schema(
  {
    name: String,
    start: Date,
    end: Date,
    buildingType: {
      type: String,
      enum: [STRINGS.LOCATIONTYPE.EXTERIOR, STRINGS.LOCATIONTYPE.INTERIOR],
      default: STRINGS.LOCATIONTYPE.INTERIOR,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    levels: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.LEVEL,
      },
    ],
    mean: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MEAN,
      },
    ],
    status: {
      type: String,
      enum: [STRINGS.STATUS.ACTIVE, STRINGS.STATUS.INACTIVE],
      default: STRINGS.STATUS.ACTIVE,
    },
    statusReason: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.BUILDING, buildingSchema);

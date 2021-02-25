const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const locationSchema = new Schema(
  {
    name: String,
    locationType: {
      type: String,
      enum: [STRINGS.LOCATIONTYPE.EXTERIOR, STRINGS.LOCATIONTYPE.INTERIOR],
    },
    address: String,
    storage: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.STORAGEAREA,
      },
    ],
    siteId: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.SITE },
    building: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.BUILDING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.LOCATION, locationSchema);

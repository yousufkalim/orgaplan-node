const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const incidentSchema = new Schema(
  {
    name: String,
    date: Date,
    isBillable: Boolean,
    location: {
      deliveryArea: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.DELIVERYAREA,
      },
      storageArea: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.STORAGEAREA,
      },
      level: {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.LEVEL,
      },
    },
    type: {
      type: String,
      enum: [STRINGS.INCIDENTTYPE.DELAY, STRINGS.INCIDENTTYPE.LETIGATON],
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
    },
    photos: [{ type: String }],
    document: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.INCIDENT, incidentSchema);

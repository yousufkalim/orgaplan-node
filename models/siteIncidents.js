const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const siteIncidentsScehema = new Schema(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    indicents: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.INCIDENT,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  STRINGS.MODALS.SITEINCIDENTS,
  siteIncidentsScehema
);

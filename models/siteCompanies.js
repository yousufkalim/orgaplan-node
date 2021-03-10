const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const siteCompaniesSchema = new Schema(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
      unique: true,
    },
    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.COMPANY,
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  STRINGS.MODALS.SITECOMPANIES,
  siteCompaniesSchema
);

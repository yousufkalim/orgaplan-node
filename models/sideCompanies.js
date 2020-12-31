const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const siteCompaniesSchema = new Schema(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
    },
    companies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteCompanies", siteCompaniesSchema);

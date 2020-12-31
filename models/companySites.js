const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySitesSchema = new Schema(
  {
    compnayId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    sites: [
      {
        site: {
          type: Schema.Types.ObjectId,
          ref: "Site",
        },
        role: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CompanySites", companySitesSchema);

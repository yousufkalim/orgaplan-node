const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSitesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
        status: {
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

module.exports = mongoose.model("UserSites", userSitesSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const zacSchema = new Schema(
  {
    name: {
      type: String,
    },
    sites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Site",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserSites", zacSchema);

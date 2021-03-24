const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const sitePicSchema = new Schema(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    shapes: [
      {
        type: {
          type: String,
          enum: ["MEAN", "BUILDING", "STORAGEAREA", "DELIVERYAREA"],
          required: true,
        },
        _id: String,
        color: String,
        name: String,
        opacity: String,
        image: String,
        points: [],
        itemId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.SITEPIC, sitePicSchema);

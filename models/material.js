const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const materialSchema = new Schema(
  {
    name: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.UNAVAILABLE,
        STRINGS.STATUS.INACTIVE,
        STRINGS.STATUS.COMPLETED,
      ],
    },
    statusReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.MATERIAL, materialSchema);

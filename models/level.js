const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const levelSchema = new Schema(
  {
    name: String,
    number: String,
    levelType: {
      type: String,
      enum: [
        STRINGS.LEVELTYPE.STORAGE,
        STRINGS.LEVELTYPE.DELIVERY,
        STRINGS.LEVELTYPE.BOTH,
      ],
    },
    storage: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.STORAGEAREA,
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.DELIVERYAREA,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.BUILDING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.LEVEL, levelSchema);

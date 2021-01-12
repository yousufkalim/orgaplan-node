const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const subscriptionSchema = new Schema(
  {
    name: String,
    startDate: Date,
    endDate: Date,
    price: Number,
    email: String,
    status: {
      type: String,
      default: STRINGS.STATUS.PENDING,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.INACTIVE,
        STRINGS.STATUS.PENDING,
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  STRINGS.MODALS.SUBSCRIPTION,
  subscriptionSchema
);

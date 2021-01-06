const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const subscriptionSchema = new Schema(
  {
    name: String,
    start: Date,
    end: Date,
    price: Number,
    subscriberID: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.INACTIVE,
        STRINGS.STATUS.CLOSED,
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

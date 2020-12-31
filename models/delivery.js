const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema(
  {
    name: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "UNAVAILABLE", "INACTIVE", "COMPLETED"],
    },
    statusReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);

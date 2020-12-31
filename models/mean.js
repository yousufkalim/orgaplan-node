const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meanSchema = new Schema(
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

module.exports = mongoose.model("Mean", meanSchema);

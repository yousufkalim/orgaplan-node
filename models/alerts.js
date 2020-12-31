const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alertSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reason: {
      type: String,
    },
    location: {
      type: String, // Question
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);

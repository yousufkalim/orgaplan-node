const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const levelSchema = new Schema(
  {
    name: {
      type: String,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "Building",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Level", levelSchema);

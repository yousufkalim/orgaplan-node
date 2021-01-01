const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingSchema = new Schema(
  {
    name: {
      type: String,
    },
    levels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Level",
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    storage: {
      type: Schema.Types.ObjectId,
      ref: "Building",
    },
    delivery: {
      type: Schema.Types.ObjectId,
      ref: "Delivery",
    },
    material: [
      {
        type: Schema.Types.ObjectId,
        ref: "Material",
      },
    ],
    mean: {
      type: Schema.Types.ObjectId,
      ref: "Mean",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INPROGRESS", "INACTIVE", "COMPLETED", "ACCIDENTs"],
    },
    statusReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Building", buildingSchema);

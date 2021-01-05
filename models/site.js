const mongoose = require("mongoose");
const { globals } = require("../utils/texts");
const { number } = require("joi");
const Schema = mongoose.Schema;

const siteSchema = new Schema(
  {
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    openingHour: {
      type: Number,
    },
    closingHour: {
      type: Number,
    },
    siteEndAlertTime: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        globals.siteStatus.active,
        globals.siteStatus.unavailable,
        globals.siteStatus.inActive,
        globals.siteStatus.completed,
      ],
    },
    unavailabilityReason: {
      type: String,
      required: false,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      buildingIds: [
        { type: Schema.Types.ObjectId, ref: "Building", required: false },
      ],
      levelIds: [{ type: Schema.Types.ObjectId, ref: "Level", require: false }],
    },
    addresses: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Site", siteSchema);

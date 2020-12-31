const mongoose = require("mongoose");
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
    status: {
      type: String,
      enum: ["ACTIVE", "UNAVAILABLE", "INACTIVE", "COMPLETED"],
    },
    statusReason: {
      type: String,
    },
    locations: [
      {
        street: {
          type: String,
        },
        // [long, lat]
        location: [{ type: Number }],
        zip: {
          type: String,
        },
        city: {
          type: String,
        },
        country: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Site", siteSchema);

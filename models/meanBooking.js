const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const meanBookingSchema = new Schema(
  {
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    bookingReason: String,
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
    },
    meanId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.MEAN,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.MEANBOOKING, meanBookingSchema);

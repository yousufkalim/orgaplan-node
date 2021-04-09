const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const deliveryArea = new Schema(
  {
    name: String,
    color: String,
    addresses: [
      {
        pdf: String,
        startDate: Date,
        endDate: Date,
        label: String,
        location: [{ type: Number }], // lat: Number, long: Number
      },
    ],
    availability: {
      start: Date,
      end: Date,
    },
    unavailabilityDates: [
      {
        date: Date,
        startHour: Number,
        endHour: Number,
        dayOff: { type: Boolean, default: false },
        reason: String,
      },
    ],
    notificationPriorToDays: Number,
    notificationTo: [{ type: String }],
    vehicles: [{ type: String }],
    deliveryAreaEndNotificaionTime: Number,
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    // means: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: STRINGS.MODALS.MEAN,
    //   },
    // ],
    // picCoordinates: {
    //   x: { type: Number },
    //   y: { type: Number },
    // },
    status: {
      type: String,
      enum: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.DELIVERYAREA, deliveryArea);

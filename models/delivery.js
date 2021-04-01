const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const deliverySchema = new Schema(
  {
    type: {
      type: String,
      enum: [STRINGS.STATUS.SCHEDULED, STRINGS.STATUS.UNSCHEDULED],
      default: STRINGS.STATUS.SCHEDULED,
    },
    deliveryArea: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.DELIVERYAREA,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.SITE,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
    },
    storageArea: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.STORAGEAREA,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
    comment: String,
    sendDeliverySummary: Boolean,
    userEmail: String,
    trades: [{ type: Schema.Types.ObjectId, ref: STRINGS.MODALS.TRADES }],
    means: [{ type: Schema.Types.ObjectId, ref: STRINGS.MODALS.MEAN }],
    materials: [String],
    isExterior: Boolean,
    building: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.BUILDING },
    level: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.LEVEL },
    date: Date,
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.PENDING,
        STRINGS.STATUS.VALIDATED,
        STRINGS.STATUS.MODIFIED,
        STRINGS.STATUS.ALERTE,
      ],
      default: STRINGS.STATUS.PENDING,
    },
    statusReason: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.DELIVERY, deliverySchema);

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
    enterpriseUser: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.USER,
      },
    ],
    materials: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MATERIAL,
      },
    ],
    means: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.MEAN,
      },
    ],
    storage: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.STORAGEAREA,
      },
    ],
    delivery: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.DELIVERYAREA,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    comments: [
      {
        comment: String,
        user: {
          role: {
            type: String,
            enum: [STRINGS.ROLES.ADMIN, STRINGS.ROLES.TRAFFIC],
          },
          id: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.USER },
        },
      },
    ],
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.INACTIVE,
        STRINGS.STATUS.UNAVAILABLE,
        STRINGS.STATUS.COMPLETED,
      ],
      default: STRINGS.STATUS.ACTIVE,
    },
    statusReason: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.DELIVERY, deliverySchema);

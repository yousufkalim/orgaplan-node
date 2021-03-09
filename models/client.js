const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const ClientSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
    },
    adminIds: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.USER,
      },
    ],
    contractIds: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.CONTRACT,
      },
    ],
    status: {
      type: String,
      enum: [
        STRINGS.STATUS.ACTIVE,
        STRINGS.STATUS.DELETED,
        STRINGS.STATUS.INACTIVE,
      ],
      default: STRINGS.STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.CLIENT, ClientSchema);

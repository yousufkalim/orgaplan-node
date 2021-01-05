const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const companySchema = new Schema(
  {
    logo: {
      type: String,
    },
    name: {
      type: String,
    },
    color: {
      type: String,
    },
    description: {
      type: String,
    },
    isSubContractor: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
      required: false,
    },
    users: [
      {
        userId: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.USER },
        role: {
          type: String,
          enum: [
            STRINGS.ROLES.ADMIN,
            STRINGS.ROLES.ENTERPRISE,
            STRINGS.ROLES.TRAFFIC,
            STRINGS.ROLES.BUFFER,
          ],
        },
        status: {
          type: String,
          enum: [STRINGS.STATUS.PENDING, STRINGS.STATUS.ACTIVE],
        },
      },
    ],
    siteIds: [{ type: Schema.Types.ObjectId, ref: STRINGS.MODALS.SITE }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.COMPANY, companySchema);

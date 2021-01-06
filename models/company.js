const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const companySchema = new Schema(
  {
    logo: String,
    name: String,
    color: String,
    description: String,
    isSubContractor: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
      required: false,
    },
    incharge: {
      firstName: { type: String },
      lastName: { type: String },
      phone: { type: Number },
      email: { type: String },
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
      },
    ],
    siteIds: [{ type: Schema.Types.ObjectId, ref: STRINGS.MODALS.SITE }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.COMPANY, companySchema);

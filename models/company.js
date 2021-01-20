const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const companySchema = new Schema(
  {
    logo: String,
    name: String,
    color: String,
    description: String,
    website: String,
    connection: [
      {
        childCompanyId: [
          {
            // Represents company subcontractors
            type: Schema.Types.ObjectId,
            ref: STRINGS.MODALS.COMPANY,
          },
        ],
        parentCompanyId: {
          // Represents company's main company if the company us subcontractor
          type: Schema.Types.ObjectId,
          ref: STRINGS.MODALS.COMPANY,
        },
        isSubContractor: {
          type: Boolean,
          default: false,
        },
        siteId: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.SITE },
      },
    ],
    incharge: {
      firstName: String,
      lastName: String,
      email: String,
      phone: Number,
    },
    trades: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.TRADES,
      },
    ],
    type: {
      type: String,
      enum: [
        STRINGS.COMPANYTYPE.CLIENTPERSITE,
        STRINGS.COMPANYTYPE.MASTERCLIENT,
        STRINGS.COMPANYTYPE.NOCLIENTS,
      ],
      default: STRINGS.COMPANYTYPE.NOCLIENTS,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.COMPANY, companySchema);

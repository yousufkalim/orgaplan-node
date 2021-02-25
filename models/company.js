const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const companySchema = new Schema(
  {
    logo: String,
    name: String,
    color: String,
    website: String,
    description: String,
    // Not in database (incharge)
    incharge: {
      firstName: String,
      lastName: String,
      email: String,
      phone: Number,
    },
    // One admin per company
    adminId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
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
            STRINGS.ROLES.ENTERPRISE,
            STRINGS.ROLES.TRAFFIC,
            STRINGS.ROLES.BUFFER,
          ],
        },
      },
    ],
    connection: [
      {
        childCompanyId: [
          {
            // Represents company subcontractors
            type: Schema.Types.ObjectId,
            ref: STRINGS.MODALS.COMPANY,
          },
        ],
        trades: [{ type: Schema.Types.ObjectId, ref: STRINGS.MODALS.TRADES }],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.COMPANY, companySchema);

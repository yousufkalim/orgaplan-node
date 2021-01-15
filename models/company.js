const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const companySchema = new Schema(
  {
    logo: String,
    name: String,
    color: String,
    description: String,
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
        siteId: { type: Schema.Types.ObjectId, ref: STRINGS.MODALS.SITE },
      },
    ],
    incharge: {
      firstName: String,
      lastName: String,
      email: String,
      phone: Number,
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

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const userSitesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },
    sites: [
      {
        site: {
          type: Schema.Types.ObjectId,
          ref: STRINGS.MODALS.SITE,
        },
        role: {
          type: String,
          enum: [
            STRINGS.ROLES.ADMIN,
            STRINGS.ROLES.TRAFFIC,
            STRINGS.ROLES.BUFFER,
            STRINGS.ROLES.ENTERPRISE,
          ],
          required: true,
        },
        status: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.USERSITES, userSitesSchema);

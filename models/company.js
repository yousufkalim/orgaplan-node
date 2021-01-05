const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { globals } = require("../utils/texts");
const companySchema = new Schema(
  {
    users: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: [
            globals.roles.admin,
            globals.roles.enterprise,
            globals.roles.trafficAgent,
            globals.roles.bufferTrafficAgent,
          ],
        },
        status: { type: String, enum: ["PENDING", "ACTIVE"] },
      },
    ],
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
      ref: "Company",
      required: false,
    },
    siteIds: [{ type: Schema.Types.ObjectId, ref: "Site" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);

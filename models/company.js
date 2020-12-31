const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    users: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["ADMIN", "SUBCONTRACTOR", "EMPLOYEE"] },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", companySchema);

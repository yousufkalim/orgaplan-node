const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCompaniesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    companies: [
      {
        company: {
          type: Schema.Types.ObjectId,
          ref: "Company",
        },
        role: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserCompanies", userCompaniesSchema);

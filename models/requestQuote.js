const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestQuoteSchema = new Schema(
  {
    companyName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    description: {
      type: String,
    },
    isPendingResponse: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RequestQuote", requestQuoteSchema);

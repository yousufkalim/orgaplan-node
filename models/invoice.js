const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Paid",
  },
  invoiceType: {
    type: String,
    enum: ["Delay", "Incident", "Unplanned Delivery", "Way"],
    default: "Delays",
  },
  information: [
    {
      name: { type: String },
      images: [{ type: String }],
      site: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      enterprise: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comments: [
        {
          comment: String,
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Invoice", invoiceSchema);

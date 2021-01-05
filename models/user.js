const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      street: {
        type: String,
      },
      // [long, lat]
      location: [{ type: Number }],
      zip: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.COMPANY,
    },
    role: {
      type: String,
      enum: [STRINGS.ROLE.USER, STRINGS.ROLE.SUPERADMIN],
      default: STRINGS.ROLE.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.USER, userSchema);

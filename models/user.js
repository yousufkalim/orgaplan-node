const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      trim: true,
    },
    password: String,
    image: String,
    phone: Number,
    address: {
      zip: String,
      city: String,
      street: String,
      country: String,
      // [long, lat]
      location: [{ type: Number }],
    },
    // Only one company per user allowed, but for future proofing, it's an array
    company: [
      {
        type: Schema.Types.ObjectId,
        ref: STRINGS.MODALS.COMPANY,
      },
    ],
    role: {
      type: String,
      enum: [STRINGS.ROLES.USER, STRINGS.ROLES.SUPERADMIN],
      default: STRINGS.ROLES.USER,
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

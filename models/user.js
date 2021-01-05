const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { globals } = require("../utils/texts");
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
    role: {
      type: String,
      trim: true,
      enum: [
        globals.roles.admin,
        globals.roles.superAdmin,
        globals.roles.enterprise,
        globals.roles.trafficAgent,
        globals.roles.bufferTrafficAgent,
      ],
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

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");
const { ref } = require("joi");

const ContractSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.USER,
    },

    contractStartDate: {
      type: Date,
      default: new Date(),
    },
    contractEndDate: {
      type: Date,
    },
    monthlyCost: {
      type: Number,
    },
    contractType: {
      type: String,
      enum: [
        STRINGS.CONTRACTTYPES.CLIENTPERSITE,
        STRINGS.CONTRACTTYPES.MASTERCLIENT,
      ],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.CONTRACT, ContractSchema);

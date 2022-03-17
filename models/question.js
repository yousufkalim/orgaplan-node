const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const questionSchema = new Schema(
  {
    question: String,
    answer: String,
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    steps: [{
      type: Schema.Types.ObjectId,
      ref: STRINGS.MODALS.QUESTIONSOLUTIONSTEP,
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.QUESTION, questionSchema);

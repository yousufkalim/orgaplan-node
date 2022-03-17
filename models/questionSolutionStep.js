const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const questionSolutionStepSchema = new Schema(
  {
    picture: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.QUESTIONSOLUTIONSTEP, questionSolutionStepSchema);

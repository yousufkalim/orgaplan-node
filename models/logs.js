// Init
const mongoose = require("mongoose");
const STRINGS = require("../utils/texts");

// Schema
const logsSchema = new mongoose.Schema({
	date: String,
	description: String,
});

// Model
module.exports = mongoose.model(STRINGS.MODALS.LOGS, logsSchema);

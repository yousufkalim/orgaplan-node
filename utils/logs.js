// Init
const logs = require("../models/logs");

// Function to write log on activities
exports.writeLog = (date, description) => {
	return logs.create({ date, description });
};

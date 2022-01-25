// Init
const logs = require("../models/logs");

// Function to write log on activities
exports.writeLog = (name, date, description) => {
  return logs.create({ name, date, description });
};

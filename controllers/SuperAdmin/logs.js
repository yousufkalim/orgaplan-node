// Init
const logs = require("../../models/logs");
const STRINGS = require("../../utils/texts");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");

// Logs Controller
class logsController {
	async getAll(req, res) {
		try {
			const logsData = await logs.find();
			res
				.status(200)
				.send(response(STRINGS.TEXTS.logsRequested, logsData.reverse()));
		} catch {
			throw new CustomError(STRINGS.ERRORS.error, 404);
		}
	}
}

module.exports = new logsController();

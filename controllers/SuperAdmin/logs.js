// Init
const logs = require("../../models/logs");
const STRINGS = require("../../utils/texts");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");

// To get items per page
const ENV = process.env;

// Logs Controller
class logsController {
  async getAll(req, res) {
    try {
      const page = +req.query.page || 1;
      const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

      const logsData = await logs
        .find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

      const totalItems = await logs.find().countDocuments();

      const result = {
        items: logsData.reverse(),
        totalItems,
        totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
        itemsPerPage: ITEMS_PER_PAGE,
        currentPage: page,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
      };

      res.status(200).send(response(STRINGS.TEXTS.logsRequested, result));
    } catch {
      throw new CustomError(STRINGS.ERRORS.error, 404);
    }
  }
}

module.exports = new logsController();

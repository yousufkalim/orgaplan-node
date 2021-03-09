const STRINGS = require("../../utils/texts");
const Company = require("../../models/company");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminAdminsController {
  async create(req, res) {
    throw new CustomError(STRINGS.ERRORS.resourceNotFound);
    res.status(200).send(response(STRINGS.TEXTS.companyCreated, "result"));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Company.find({
      company: { $ne: undefined },
    }).countDocuments();

    const items = await Company.find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("adminIds");

    if (!items) throw new CustomError(STRINGS.ERRORS.error, 404);

    const result = {
      items,
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
    res.status(200).send(response(STRINGS.TEXTS.companysRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await Company.findById(id, { password: 0, __v: 0 }).populate(
      "adminIds"
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.adminNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
  }

  async update(req, res) {
    throw new CustomError(STRINGS.ERRORS.resourceNotFound);

    res.status(201).send(response(STRINGS.TEXTS.companyUpdated, "result"));
  }

  async delete(req, res) {
    throw new CustomError(STRINGS.ERRORS.resourceNotFound);

    res.status(201).send(response(STRINGS.TEXTS.companyDeleted, "result"));
  }
}

module.exports = new SuperAdminAdminsController();

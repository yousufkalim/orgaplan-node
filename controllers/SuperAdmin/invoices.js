const STRINGS = require("../../utils/texts");
const Invoice = require("../../models/invoice");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminInvoicesController {
  async create(req, res) {
    const validatedData = await Validations.invoice.create(req.body);

    let result = await Invoice.create(validatedData);
    result = await result.populate("createdBy").execPopulate();

    res.status(200).send(response(STRINGS.TEXTS.contractCreated, result));
  }

  async getAll(req, res) {
    const clientId = req.params.clientId;
    const contractId = req.params.contractId;

    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Invoice.find().countDocuments();
    const items = await Invoice.find({}, { __v: 0, password: 0 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("createdBy");

    if (!items) throw new CustomError(STRINGS.ERRORS.error);

    const result = {
      items,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    };
    res.status(200).send(response(STRINGS.TEXTS.invoicesRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await Invoice.findById(id, { password: 0, __v: 0 })
      .populate("createdBy")
      .populate("information.userId")
      .populate("information.comments.userId");

    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.invoiceRequested, result));
  }

  async update(req, res) {
    const validatedData = await Validations.invoice.update(req.body);

    const result = await Invoice.findByIdAndUpdate(validatedData.invoiceId, {
      $set: validatedData,
    });

    if (!result) throw new CustomError(STRINGS.ERRORS.invoiceNotFound, 404);

    res.status(201).send(response(STRINGS.TEXTS.invoiceUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Invoice.findByIdAndRemove(id);
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(201).send(response(STRINGS.TEXTS.invoiceDeleted, result));
  }
}

module.exports = new SuperAdminInvoicesController();

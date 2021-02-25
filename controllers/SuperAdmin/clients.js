const User = require("../../models/user");
const STRINGS = require("../../utils/texts");
const Client = require("../../models/client");
const Company = require("../../models/company");
const Validations = require("../../validators");
const response = require("../../utils/response");
const Contract = require("../../models/contract");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminClientsController {
  async create(req, res) {
    const validatedData = await Validations.client.create(req.body);

    // Check company if already exists
    const companyCheck = await Company.findOne({
      name: validatedData.name,
    });
    if (companyCheck)
      throw new CustomError(STRINGS.ERRORS.companyAlreadyExists, 409);

    // Create User Company
    const companyData = {
      ...validatedData,
      incharge: { ...validatedData },
      type: validatedData.contractType,
    };

    const company = await Company.create(companyData);
    validatedData.companyId = company._id;

    // Create a contract
    let contract = await new Contract({
      ...validatedData,
      isPendingResponse: false,
    }).save();

    // Create a client
    let client = await Client.create({
      companyId: company._id,
      contractsIds: [contract._id],
    });
    client = await client
      .populate("userId")
      .populate("companyId")
      .populate("contractsIds")
      .execPopulate();

    res.status(200).send(response(STRINGS.TEXTS.clientCreated, client));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Client.find().countDocuments();
    const items = await Client.find(null, { __v: 0, password: 0 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("userId")
      .populate("companyId")
      .populate("contractsIds");

    if (!items) throw new CustomError(STRINGS.ERRORS.error, 404);

    const result = {
      items,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    };
    res.status(200).send(response(STRINGS.TEXTS.clientsRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await Client.findById(id, { password: 0, __v: 0 })
      .populate("userId")
      .populate("companyId")
      .populate("contractsIds");

    if (!result) throw new CustomError(STRINGS.ERRORS.clientNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.clientRequested, result));
  }

  async update(req, res) {
    const validatedData = await Validations.client.update(req.body);

    const companyData = {
      ...validatedData,
      incharge: { ...validatedData },
      type: validatedData.contractType,
    };
    validatedData.logo && (companyData.logo = validatedData.logo);

    await Company.findByIdAndUpdate(validatedData.companyId, {
      $set: companyData,
    });

    await Contract.findByIdAndUpdate(validatedData.contractId, {
      $set: validatedData,
    });

    const result = await Client.findById(validatedData.clientId)
      .populate("userId")
      .populate("companyId")
      .populate("contractsIds");

    if (!result) throw new CustomError(STRINGS.ERRORS.clientNotFound, 404);

    res.status(201).send(response(STRINGS.TEXTS.clientUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    // const result = await Client.findByIdAndRemove(id);
    // if (!result) throw new CustomError(STRINGS.ERRORS.clientNotFound, 404);

    res.status(201).send(response(STRINGS.TEXTS.clientDeleted, "result"));
  }
}

module.exports = new SuperAdminClientsController();

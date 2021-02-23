const Auth = require("../auth");
const User = require("../../models/user");
const STRINGS = require("../../utils/texts");
const Client = require("../../models/client");
const Company = require("../../models/company");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminClientsController {
  async create(req, res) {
    const validatedData = await Validations.quote.create(req.body);

    // Create User
    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
    };

    const userCheck = await User.findOne({ email: validatedData.email });
    if (userCheck) throw new CustomError(STRINGS.ERRORS.userAlreadyExists);

    const companyCheck = await Company.findOne({
      name: validatedData.name,
    });
    if (companyCheck)
      throw new CustomError(STRINGS.ERRORS.companyAlreadyExists);

    const user = await Auth.signup(userData);
    const userId = user.user._id;

    validatedData["userId"] = userId;

    // Create User Company
    const companyUsers = [{ userId: userId, role: STRINGS.ROLES.ADMIN }];
    const companyData = {
      name: validatedData.name,
      connection: [],
      incharge: userData,
      users: companyUsers,
      type: validatedData.contractType,
    };
    const company = await new Company(companyData).save();
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { company: company._id },
      },
      { new: true }
    );

    let client = await Client.create({
      userId: userId,
      companyId: company._id,
      contract: [],
    });
    client = await client
      .populate("userId")
      .populate("companyId")
      .populate("contract")
      .execPopulate();

    await res.status(200).send(response(STRINGS.TEXTS.clientCreated, client));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Client.find().countDocuments();
    const items = await Client.find({ contract: [] }, { __v: 0, password: 0 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("userId")
      .populate("companyId")
      .populate("contract");

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
    res.status(200).send(response(STRINGS.TEXTS.clientsRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await Client.findById(id, { password: 0, __v: 0 })
      .populate("userId")
      .populate("companyId")
      .populate("contract");

    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.clientRequested, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Client.findByIdAndRemove(id);
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(201).send(response(STRINGS.TEXTS.clientDeleted, result));
  }
}

module.exports = new SuperAdminClientsController();

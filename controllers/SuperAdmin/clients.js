const Auth = require("../auth");
const STRINGS = require("../../utils/texts");
const Client = require("../../models/client");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminClientsController {
  async create(req, res) {
    console.log("req.body", req.body);
    const validatedData = Validations.client.create(req.body);

    // Create User
    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
    };

    const user = await Auth.signup(userData);
    const userId = user.user._id;

    validatedData["userId"] = userId;

    await new Contract(validatedData).save();

    if (user.exists) {
      await res
        .status(200)
        .send(response(STRINGS.TEXTS.emailVerificationSent, user));
      return;
    }

    // Create User Company if it does not exist
    const companyConnection = [];
    const companyUsers = [{ userId: userId, role: STRINGS.ROLES.ADMIN }];
    const companyResult = await Company.findOne({
      name: validatedData.companyName,
    });
    if (companyResult)
      throw new CustomError(STRINGS.ERRORS.companyAlreadyAdded);
    const companyData = {
      logo: validatedData.companyLogo,
      name: validatedData.companyName,
      color: validatedData.companyColor,
      connection: companyConnection,
      incharge: userData,
      users: companyUsers,
      type: validatedData.contractType,
    };
    const company = await new Company(companyData).save();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { company: company._id },
      },
      { new: true }
    )
      .populate("userId")
      .populate("companyId");

    await Client({
      companyId: company._id,
      userId: userId,
      contractStartDate: validatedData.contractStartDate,
      contractEndDate: validatedData.contractEndDate,
      additionalInfo: validatedData.additionalInfo,
      notificationPriorToDays: validatedData.notificationPriorToDays,
      notificationTo: validatedData.notificationTo,
    }).save();
    await res
      .status(200)
      .send(response(STRINGS.TEXTS.clientUpdated, updatedUser));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Client.find().countDocuments();
    const clients = await Client.find(null, { __v: 0, password: 0 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("userId")
      .populate("companyId");

    if (!totalItems || !clients) throw new CustomError(STRINGS.ERRORS.error);

    const result = {
      items: clients,
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
      .populate("companyId");
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.clientRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Client.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    )
      .populate("userId")
      .populate("companyId");

    if (!result) throw new CustomError(STRINGS.ERRORS.tradeNotFount, 404);

    res.status(201).send(response(STRINGS.TEXTS.tradeUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Client.findByIdAndRemove(id);
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(201).send(response(STRINGS.TEXTS.clientDeleted, result));
  }
}

module.exports = new SuperAdminClientsController();

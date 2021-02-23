const Auth = require("../auth");
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

    // Create User
    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
    };

    const userCheck = await User.findOne({ email: validatedData.email });
    const companyCheck = await Company.findOne({
      name: validatedData.name,
    });
    if (!userCheck && companyCheck)
      throw new CustomError(STRINGS.ERRORS.companyAlreadyExists);

    const user = await Auth.signup(userData);
    const userId = user.user._id;

    validatedData["userId"] = userId;

    // If MasterClient and user exists
    if (
      validatedData.contractType === STRINGS.CONTRACTTYPES.MASTERCLIENT &&
      user.exists
    ) {
      res.status(200).send(response(STRINGS.TEXTS.clientExistsAlready, user));
      return;
    }

    // If ClientPerSite and user exists
    if (
      validatedData.contractType === STRINGS.CONTRACTTYPES.CLIENTPERSITE &&
      user.exists
    ) {
      // Create a new contract and add it to the client document
      let contract = await new Contract(validatedData).save();
      let client = await Client.findOneAndUpdate(
        { userId },
        { $addToSet: { contract: contract._id } },
        {
          new: true,
        }
      )
        .populate("userId")
        .populate("companyId")
        .populate("contract");

      res.status(200).send(response(STRINGS.TEXTS.contractCreated, client));
      return;
    }

    // Create User Company
    const companyUsers = [{ userId: userId, role: STRINGS.ROLES.ADMIN }];
    const companyData = {
      logo: validatedData.logo,
      name: validatedData.name,
      color: validatedData.color,
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

    let contract = await new Contract({
      ...validatedData,
      isPendingResponse: false,
    }).save();

    let client = await Client.create({
      userId: userId,
      companyId: company._id,
      contract: [contract._id],
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
    const items = await Client.find(null, { __v: 0, password: 0 })
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

  async update(req, res) {
    const validatedData = await Validations.client.update(req.body);

    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
    };

    const user = await User.findByIdAndUpdate(validatedData.userId, {
      $set: userData,
    });
    if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);

    const companyData = {
      color: validatedData.color,
      incharge: userData,
      type: validatedData.contractType,
    };
    validatedData.logo && (companyData.logo = validatedData.logo);

    await Company.findByIdAndUpdate(validatedData.companyId, {
      $set: companyData,
    });

    await Contract.findByIdAndUpdate(validatedData.contractId, {
      $set: validatedData,
    });

    const result = await Client.findById({ _id: validatedData.clientId })
      .populate("userId")
      .populate("companyId")
      .populate("contract");

    if (!result) throw new CustomError(STRINGS.ERRORS.clientNotFound, 404);

    res.status(201).send(response(STRINGS.TEXTS.clientUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Client.findByIdAndRemove(id);
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(201).send(response(STRINGS.TEXTS.clientDeleted, result));
  }

  async verifyRequest(req, res) {
    const validatedData = await Validations.client.verify(req.body);

    await Company.findByIdAndUpdate(validatedData.companyId, {
      $set: {
        logo: validatedData.logo,
        color: validatedData.color,
      },
    });
    let contract = await Contract.create({
      ...validatedData,
      isPendingResponse: false,
      userId: validatedData.clientId,
    });

    const result = await Client.findByIdAndUpdate(
      validatedData.clientId,
      {
        $addToSet: { contract: contract._id },
      },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.clientNotFound, 404);

    res.status(201).send(response(STRINGS.TEXTS.clientVerified, result));
  }
}

module.exports = new SuperAdminClientsController();

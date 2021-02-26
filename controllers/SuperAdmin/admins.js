const Auth = require("../auth");
const User = require("../../models/user");
const STRINGS = require("../../utils/texts");
const Client = require("../../models/client");
const Company = require("../../models/company");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminAdminsController {
  async create(req, res) {
    const validatedData = Validations.admin.create(req.body);

    // Check Company
    const companyCheck = await Company.findById(validatedData.companyId);
    if (!companyCheck)
      throw new CustomError(STRINGS.ERRORS.companyNotFound, 404);

    if (companyCheck.adminId)
      throw new CustomError(STRINGS.ERRORS.adminExistsForCompany, 404);

    // Create Login User
    const user = await Auth.signup({
      ...validatedData,
      company: validatedData.companyId,
    });
    if (!user) throw new CustomError(STRINGS.ERRORS.error, 404);

    // Update Client
    await Client.findOneAndUpdate(
      { companyId: validatedData.companyId },
      {
        $set: { userId: user._id },
      }
    );

    // Update Company
    await Company.findByIdAndUpdate(validatedData.companyId, {
      $set: { adminId: user._id },
    });

    const result = await User.findById(user._id).populate("company");

    res.status(200).send(response(STRINGS.TEXTS.adminCreated, result));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await User.find({
      company: { $ne: undefined },
    }).countDocuments();

    const items = await User.find(
      { company: { $ne: undefined } },
      {
        __v: 0,
        password: 0,
      }
    )
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("company");

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
    res.status(200).send(response(STRINGS.TEXTS.adminsRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await User.findById(id, { password: 0, __v: 0 }).populate(
      "company"
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.adminNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.adminRequested, result));
  }

  async update(req, res) {
    const validatedData = Validations.admin.update(req.body);

    // Check User
    const userCheck = await User.findById(validatedData.userId);
    if (!userCheck) throw new CustomError(STRINGS.ERRORS.userNotFound, 404);

    // If company needs to be changed
    if (String(userCheck.company) !== String(validatedData.companyId)) {
      // Update Client
      // (remove)
      await Client.findOneAndUpdate(
        { companyId: userCheck.companyId },
        {
          $set: { userId: undefined },
        }
      );
      // Update Client
      // (add)
      await Client.findOneAndUpdate(
        { companyId: validatedData.companyId },
        {
          $set: { userId: validatedData.userId },
        }
      );

      // Update Company
      // (remove)
      await Company.findByIdAndUpdate(userCheck.companyId, {
        $set: { adminId: undefined },
      });
      // (add)
      await Company.findByIdAndUpdate(validatedData.companyId, {
        $set: { adminId: userCheck._id },
      });
    }

    const userData = {
      phone: validatedData.phone,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      company: validatedData.companyId,
    };
    validatedData.image && (userData.image = validatedData.image);

    // Update user
    const result = await User.findByIdAndUpdate(
      validatedData.userId,
      {
        $set: userData,
      },
      { new: true }
    ).populate("company");

    if (!result) throw new CustomError(STRINGS.ERRORS.adminNotFound, 404);

    res.status(201).send(response(STRINGS.TEXTS.adminUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await User.findByIdAndRemove(id);
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(201).send(response(STRINGS.TEXTS.adminDeleted, result));
  }
}

module.exports = new SuperAdminAdminsController();

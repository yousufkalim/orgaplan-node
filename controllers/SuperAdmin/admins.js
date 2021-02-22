const Auth = require("../auth");
const User = require("../../models/user");
const STRINGS = require("../../utils/texts");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminAdminsController {
  async create(req, res) {
    const validatedData = Validations.admin.create(req.body);

    // Create User
    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      image: validatedData.image,
      role: STRINGS.ROLES.USER,
    };

    const user = await Auth.signup(userData);

    res.status(200).send(response(STRINGS.TEXTS.adminCreated, user));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await User.find().countDocuments();
    const items = await User.find(null, { __v: 0, password: 0 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

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
    res.status(200).send(response(STRINGS.TEXTS.adminRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await User.findById(id, { password: 0, __v: 0 });

    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.adminRequested, result));
  }

  async update(req, res) {
    const validatedData = Validations.admin.update(req.body);

    const userData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      image: validatedData.image,
      role: STRINGS.ROLES.USER,
    };

    validatedData.image && (userData.image = validatedData.image);

    const result = await User.findByIdAndUpdate(
      validatedData.userId,
      {
        $set: userData,
      },
      { new: true }
    );

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

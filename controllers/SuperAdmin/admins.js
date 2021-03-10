const Auth = require("../auth");
const User = require("../../models/user");
const Site = require("../../models/site");
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
        $addToSet: { adminIds: user._id },
      }
    );

    // Update Company
    await Company.findByIdAndUpdate(validatedData.companyId, {
      $addToSet: { adminIds: user._id },
    });

    const result = await User.findById(user._id).populate("company");

    res.status(200).send(response(STRINGS.TEXTS.adminCreated, result));
  }

  async getAll(req, res) {
    const name = req.query.name || "";
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    var re = new RegExp(`^${name}`, "i");

    let totalItems = await User.aggregate([
      {
        $match: {
          firstName: { $regex: re },
          company: { $ne: undefined },
          status: { $ne: STRINGS.STATUS.DELETED },
        },
      },
      { $count: "Total" },
    ]);

    const items = await User.aggregate([
      {
        $match: {
          firstName: { $regex: re },
          company: { $ne: undefined },
          status: { $ne: STRINGS.STATUS.DELETED },
        },
      },
      {
        $lookup: {
          from: Company.collection.name,
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $lookup: {
          from: Site.collection.name,
          localField: "_id",
          foreignField: "adminId",
          as: "sites",
        },
      },
      {
        $addFields: {
          sites: {
            $filter: {
              input: "$sites",
              as: "site",
              cond: {
                $ne: ["$$site.status", STRINGS.STATUS.ARCHIVED],
              },
            },
          },
        },
      },
      {
        $addFields: { sites: { $size: "$sites" } },
      },
      { $unwind: "$company" },
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
    ]);

    if (!items) throw new CustomError(STRINGS.ERRORS.error, 404);
    totalItems = totalItems.length > 0 ? totalItems[0].Total : 0;
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
    const userCheck = await User.findById(validatedData.adminId);
    if (!userCheck) throw new CustomError(STRINGS.ERRORS.adminNotFound, 404);

    // If company needs to be changed
    if (String(userCheck.company) !== String(validatedData.companyId)) {
      // Update Client
      // (remove)
      await Client.findOneAndUpdate(
        { companyId: userCheck.companyId },
        {
          $pull: { adminIds: validatedData.adminId },
        }
      );
      // Update Client
      // (add)
      await Client.findOneAndUpdate(
        { companyId: validatedData.companyId },
        {
          $addToSet: { adminIds: validatedData.adminId },
        }
      );

      // Update Company
      // (remove)
      await Company.findByIdAndUpdate(userCheck.companyId, {
        $pull: { adminIds: userCheck._id },
      });
      // (add)
      await Company.findByIdAndUpdate(validatedData.companyId, {
        $addToSet: { adminIds: userCheck._id },
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
      validatedData.adminId,
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

    // Check User
    const userCheck = await User.findById(id);
    if (!userCheck) throw new CustomError(STRINGS.ERRORS.userNotFound, 404);

    const siteCheck = await Site.findOne({ adminId: userCheck._id });
    if (siteCheck) throw new CustomError(STRINGS.ERRORS.deleteSiteFirst, 404);

    // Update Client
    await Client.findOneAndUpdate(
      { companyId: userCheck.company },
      {
        $pull: { adminIds: userCheck._id },
      }
    );

    // Update Company
    await Company.findByIdAndUpdate(userCheck.company, {
      $pull: { adminIds: userCheck._id },
    });

    const countUsers = await User.find().countDocuments();

    await User.findByIdAndUpdate(id, {
      $set: {
        firstName: userCheck.firstName[0],
        lastName: userCheck.lastName[0],
        email: `AAA@${countUsers}.com`,
        phone: 9999999999,
        image: "uploads/avatar.jpeg",
        status: STRINGS.STATUS.DELETED,
      },
    });

    const result = {
      _id: userCheck._id,
      name: `${userCheck.firstName} ${userCheck.lastName}`,
    };

    res.status(201).send(response(STRINGS.TEXTS.adminDeleted, result));
  }
}

module.exports = new SuperAdminAdminsController();

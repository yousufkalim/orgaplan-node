const User = require("../models/user");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const UserSites = require("../models/userSites");
const SiteCompanies = require("../models/SiteCompanies");
const siteCompaniesSchema = require("../models/SiteCompanies");
const SiteCompaniesModel = require("../models/SiteCompanies");

const Company = require("../models/company");
const Auth = require("../controllers/auth");
const ObjectId = require("mongodb").ObjectID;
const Validations = require("../validators");

const bcrypt = require("bcryptjs");
const ENV = process.env;

class UserContoller {
  async create(req, res) {
    const body = req.body;
    if (body.address) body.address = JSON.parse(body.address);
    body.password = await bcrypt.hash(body.password, +ENV.BCRYPT_SALT);

    const result = await new User(body).save();
    res.status(200).send(response(STRINGS.TEXTS.userCreated, result));
  }

  async register(req, res) {
    const body = req.body;
    if (body.address) body.address = JSON.parse(body.address);
    body.password = await bcrypt.hash(body.password, +ENV.BCRYPT_SALT);
    const user = await User.findOne({ email: body.email });
    user.password = body.password;
    user.isVerified = true;
    if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);

    const result = await user.update(user);
    res.status(200).send(response(STRINGS.TEXTS.userCreated, result));
  }

  async getAll(req, res) {
    const result = await User.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allUsers, result));
  }

  async getOne(req, res) {
    const userId = req.params.userId;

    const result = await User.findOne({ _id: userId }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.userNotFound);

    res.status(200).send(response(STRINGS.TEXTS.userData, result));
  }

  async getAddUser(req, res) {
    const siteId = req.params.siteId;
    const adminId = req.params.adminId;
    const userSites = await UserSites.find({
      "sites.siteId": siteId,
      $and: [{ "sites.role": { $ne: STRINGS.ROLES.ADMIN } }],
    })
      .populate("userId")
      .populate("sites.siteId");
    const site_companies = await SiteCompanies.findOne({
      siteId: siteId,
    }).populate({ path: "companies", populate: { path: "companyId" } });

    let result = {
      users: userSites,
      site_companies,
      roles: [
        STRINGS.ROLES.BUFFER,
        STRINGS.ROLES.TRAFFIC,
        STRINGS.ROLES.ENTERPRISE,
      ],
    };
    res.status(200).send(response(STRINGS.TEXTS.allUsers, result));
  }

  async getUserCompany(req, res) {
    const siteId = req.params.siteId;
    const userId = req.params.userId;

    const result = await Company.findOne({
      "users.userId": userId,
      "users.siteId": siteId,
    });
    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);
    res.status(200).send(response(STRINGS.TEXTS.companyData, result));
  }

  async adminCreateUser(req, res) {
    const body = req.body;
    const siteId = body.siteId;
    if (req.file) {
      body.image = req.file.path;
    }

    const user = await User.findOne({ email: body.email });
    if (user) {
      // User Already Exists
      const user_sites = await UserSites.findOne({
        userId: user._id,
      }).populate("sites.siteId");
      const user_companies = await Company.find({ "users.userId": user._id });

      res.status(200).send(
        response(STRINGS.TEXTS.userCreated, {
          user_sites,
          user_companies: user_companies,
          userExists: true,
        })
      );
    } else {
      const newUser = await User.create(req.body); // Create new user
      const userId = newUser._id;
      if (body.sites) body.sites = JSON.parse(body.sites);
      const userSite = await UserSites.create({
        userId: userId,
        sites: body.sites,
      });

      const sitesClone = [...body.sites];
      sitesClone.forEach((item, index) => {
        sitesClone[index].userId = userId;
      });
      body.sites = sitesClone;
      const company = await Company.findByIdAndUpdate(
        body.companyId,
        {
          $push: { users: { $each: body.sites } },
        },
        { new: true }
      );
      res
        .status(200)
        .send(
          response(STRINGS.TEXTS.userCreated, newUser, { userExists: false })
        );
    }

    //  if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);

    //const result = await user.update(user);
    //res.status(200).send(response(STRINGS.TEXTS.userCreated, result));
  }

  async createCompanyUser(req, res) {
    // const data = req.body;
    const validatedData = await Validations.user.createCompanyUser(req.body);
    const {
      siteId,
      firstName,
      lastName,
      email,
      phone,
      companyId,
      role,
    } = validatedData;
    const roleCheck = await siteCompaniesSchema.findOne({
      siteId: siteId,
      "users.companyId": companyId,
      "users.role": role,
    });
    console.log("roleCheck", roleCheck);
    // return;
    if (roleCheck) {
      throw new CustomError(STRINGS.ERRORS.roleOfCompanyAlreadyExist, 404);
    } else {
      const companyCheck = await Company.findById(companyId);
      if (!companyCheck)
        throw new CustomError(STRINGS.ERRORS.companyNotFound, 404);
      const userCheck = await User.findOne({ email: email });
      if (userCheck) {
        const siteObj = [
          {
            siteId: siteId,
            role: role,
          },
        ];
        const createdUserSite = await UserSites.findOneAndUpdate({
          userId: userCheck._id,
          $addToSet: { sites: siteObj },
        });

        const siteCompany = [
          {
            userId: userCheck._id,
            companyId: companyId,
            role: role,
          },
        ];
        const createdSiteCompany = await siteCompaniesSchema.findOneAndUpdate({
          siteId: siteId,
          $addToSet: { users: siteCompany },
        });

        const obj = {
          userSite: createdUserSite,
          siteCompany: createdSiteCompany,
        };
        await res.status(200).send(response(STRINGS.TEXTS.userCreated, obj));
      } else {
        const userData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        };
        const user = await Auth.signup(userData);

        if (!user) throw new CustomError(STRINGS.ERRORS.error, 404);

        const siteObj = [
          {
            siteId: siteId,
            role: role,
          },
        ];
        const createdUserSite = await UserSites.findOneAndUpdate({
          userId: user._id,
          $addToSet: { sites: siteObj },
        });

        const siteCompany = [
          {
            userId: user._id,
            companyId: companyId,
            role: role,
          },
        ];
        const createdSiteCompany = await siteCompaniesSchema.findOneAndUpdate({
          siteId: siteId,
          $addToSet: { users: siteCompany },
        });

        const obj = {
          user: user,
          userId: createdUserSite,
          siteCompany: createdSiteCompany,
        };
        await res.status(200).send(response(STRINGS.TEXTS.userCreated, obj));
      }
      const siteObj = [
        {
          siteId: siteId,
          role: role,
        },
      ];
      const createdUserSite = await UserSites.findOneAndUpdate({
        userId: user._id,
        $addToSet: { sites: siteObj },
      });

      const siteCompany = [
        {
          userId: user._id,
          companyId: companyId,
          role: role,
        },
      ];
      const createdSiteCompany = await siteCompaniesSchema.findOneAndUpdate({
        siteId: siteId,
        $addToSet: { users: siteCompany },
      });

      const obj = {
        // user: user,
        userId: createdUserSite,
        siteCompany: createdSiteCompany,
      };
      await res.status(200).send(response(STRINGS.TEXTS.userCreated, obj));
    }
  }

  async updateCompanyUser(req, res) {
    const { userId, siteId, email, companyId, role } = req.body;
    console.log(req.body);
    const roleCheck = await siteCompaniesSchema.findOne({
      siteId: siteId,
      "users.companyId": companyId,
      "users.role": role,
    });
    if (roleCheck) {
      throw new CustomError(STRINGS.ERRORS.roleOfCompanyAlreadyExist, 404);
    } else {
      const userCheck = await User.findOne({ email: email });
      if (userCheck) {
        const createdUserSite = await UserSites.findOneAndUpdate(
          {
            userId: ObjectId(userId),
          },
          { $set: { "sites.$[el].role": role } },
          {
            arrayFilters: [{ "el.siteId": ObjectId(siteId) }],
            new: true,
          }
        );
        const siteCompanies = await SiteCompaniesModel.findOneAndUpdate(
          {
            siteId: ObjectId(siteId),
          },
          { $set: { "users.$[el].role": role } },
          {
            arrayFilters: [
              {
                "el.companyId": ObjectId(companyId),
                "el.userId": ObjectId(userId),
              },
            ],
            new: true,
          }
        );
        const obj = {
          userSite: createdUserSite,
          siteCompany: siteCompanies,
        };
        await res.status(200).send(response(STRINGS.TEXTS.userUpdated, obj));
      } else {
        throw new CustomError(STRINGS.ERRORS.error, 404);
      }
    }
  }

  async userFilter(req, res) {
    const siteId = req.body.siteId;
    const companyId = req.body.companyId;
    const name = req.body.name;
    let re = new RegExp(`^${name}`);
    let result;
    if (name) {
      const response = await SiteCompaniesModel.findOne({
        siteId: siteId,
        $and: [
          companyId
            ? { users: { $elemMatch: { companyId: ObjectId(companyId) } } }
            : {},
        ],
      })
        .populate({
          path: "users.userId",
          match: { firstName: { $regex: re, $options: "i" } },
        })
        .populate("users.companyId");
      result = response;
    } else {
      const response = await SiteCompaniesModel.findOne({
        siteId: siteId,
        $and: [
          companyId
            ? { users: { $elemMatch: { companyId: ObjectId(companyId) } } }
            : {},
        ],
      })
        .populate({
          path: "users.userId",
        })
        .populate("users.companyId");
      result = response;
    }
    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);
    res.status(200).send(response(STRINGS.TEXTS.companyData, result));
  }

  async update(req, res) {
    const userId = req.params.userId;
    const data = req.body;

    const result = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.userNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.userUpdated, result));
  }

  async delete(req, res) {
    const userId = req.params.userId;

    const result = await User.findOne({ _id: userId });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.userDeleted, result));
  }
}

module.exports = new UserContoller();

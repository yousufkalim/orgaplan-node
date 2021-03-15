const User = require("../models/user");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const UserSites = require("../models/userSites");
const SiteCompanies = require("../models/SiteCompanies");
const Company = require("../models/company");
const bcrypt = require("bcryptjs");
const ENV = process.env;

class UserContoller {
  async create(req, res) {
    const body = req.body;
    body.address = JSON.parse(body.address);
    body.password = await bcrypt.hash(body.password, +ENV.BCRYPT_SALT);

    const result = await new User(body).save();
    res.status(200).send(response(STRINGS.TEXTS.userCreated, result));
  }

  async register(req, res) {
    const body = req.body;
    body.address = JSON.parse(body.address);
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
    }).populate("userId");
    const site_companies = await SiteCompanies.findOne({
      siteId: siteId,
    }).populate("companies");

    const admin_sites = await UserSites.findOne({
      userId: adminId,
      $and: [{ "sites.role": { $eq: STRINGS.ROLES.ADMIN } }],
    }).populate("sites.siteId");
    let result = {
      users: userSites,
      site_companies,
      admin_sites,
      roles: [
        STRINGS.ROLES.BUFFER,
        STRINGS.ROLES.TRAFFIC,
        STRINGS.ROLES.ENTERPRISE,
      ],
    };
    res.status(200).send(response(STRINGS.TEXTS.allUsers, result));
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
      console.log(JSON.stringify(company, null, 2));
      res.status(200).send(response(STRINGS.TEXTS.userCreated, newUser));
    }

    //  if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);

    //const result = await user.update(user);
    //res.status(200).send(response(STRINGS.TEXTS.userCreated, result));
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

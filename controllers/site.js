const Site = require("../models/site");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Company = require("../models/company");
const UserSites = require("../models/userSites");
const SiteCompanies = require("../models/SiteCompanies");

class SiteController {
  async create(req, res) {
    const body = req.body;
    if (req.file) {
      body.logo = req.file.path;
    }
    if (body.means) body.means = JSON.parse(body.means);
    if (body.trades) body.trades = JSON.parse(body.trades);
    const result = await new Site(req.body).save();

    if (result) {
      const sites = [{ siteId: result._id, role: STRINGS.ROLES.ADMIN }];
      await new UserSites({ sites: sites, userId: body.adminId }).save();
      const adminCompany = await Company.findOne({
        "users.userId": body.adminId,
        "users.role": STRINGS.ROLES.ADMIN,
      });
      await new SiteCompanies({
        siteId: result._id,
        companies: [adminCompany._id],
      }).save();

      res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
    }
  }

  async getAll(req, res) {
    const result = await Site.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Site.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound);

    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;
    if (data.trades) data.trades = JSON.parse(data.trades);
    if (data.means) data.means = JSON.parse(data.means);
    const result = await Site.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.siteUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Site.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.siteDeleted, result));
  }
}

module.exports = new SiteController();

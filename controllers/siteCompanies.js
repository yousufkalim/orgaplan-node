const SiteCompaniesModel = require("../models/SiteCompanies");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
class SiteCompanies {
  async create(req, res) {
    const data = req.body;
    const result = await SiteCompaniesModel.findOne({ siteId: data.siteId });
    if (!result) {
      const siteCompanies = await new SiteCompaniesModel({
        siteId: data.siteId,
        companies: [data.companyId],
      }).save();
      res
        .status(200)
        .send(response(STRINGS.TEXTS.siteCompanyRequested, siteCompanies));
    } else {
      const siteIndex = result.companies.findIndex(
        (comp) => String(comp) === String(data.companyId)
      );
      if (siteIndex == -1) {
        result.companies.push(data.companyId);
        await result.save();
        res
          .status(200)
          .send(response(STRINGS.TEXTS.siteCompanyRequested, result));
      } else {
        throw new CustomError(STRINGS.ERRORS.companyAlreadyAdded);
      }
    }
  }

  async getAll(req, res) {
    const result = await SiteCompaniesModel.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.siteCompanyRequested, result));
  }

  async getOne(req, res) {
    const siteId = req.params.siteId;

    const result = await SiteCompaniesModel.findOne({
      siteId: siteId,
    }).populate({
      path: "companies",
      populate: {
        path: "connection.parentCompanyId",
        model: STRINGS.MODALS.COMPANY,
      },
    });
    if (!result) throw new CustomError(STRINGS.ERRORS.siteCompanyNotFound);

    res.status(200).send(response(STRINGS.TEXTS.siteCompanyRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;
    if (data.incharge) data.incharge = JSON.parse(data.incharge);
    const result = await SiteCompaniesModel.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.siteCompanyNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.siteCompanyUpdated, result));
  }

  async addUser(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await SiteCompaniesModel.findById({ _id: id });

    if (!result) throw new CustomError(STRINGS.ERRORS.siteCompanyNotFound, 404);
    const resultClone = [...result.users];
    if (!data.userId) throw new CustomError(STRINGS.ERRORS.userIdRequired, 404);
    if (!data.role) throw new CustomError(STRINGS.ERRORS.userRoleRequired, 404);

    const usersClone = [...result.users];
    usersClone.push(data);
    result.users = usersClone;
    await result.updateOne(result);
    res.status(200).send(response(STRINGS.TEXTS.userAdded, result));
  }

  async deleteSiteCompanies(req, res) {
    const siteId = req.params.siteId;
    const data = req.body;

    const companySites = await SiteCompaniesModel.findOne({ siteId: siteId });
    if (companySites.companies.some((site) => site == data.companyId)) {
      const result = await SiteCompaniesModel.findOneAndUpdate(
        {
          siteId: siteId,
        },
        { $pull: { companies: data.companyId } }
      );
      res.status(200).send(response(STRINGS.TEXTS.compantDeleted, result));
    } else throw new CustomError(STRINGS.ERRORS.companyNotFound, 404);
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await SiteCompaniesModel.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.compantDeleted, result));
  }
}

module.exports = new SiteCompanies();

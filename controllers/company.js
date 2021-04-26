const Site = require("../models/site");
const STRINGS = require("../utils/texts");
const Auth = require("../controllers/auth");
const Company = require("../models/company");
const ObjectId = require("mongodb").ObjectID;
const response = require("../utils/response");
const UserSites = require("../models/userSites");
const CustomError = require("../utils/customError");
const SiteCompanies = require("../models/SiteCompanies");

class CompanyController {
  async create(req, res) {
    const validatedData = req.body;
    validatedData.trades = JSON.parse(validatedData.trades);
    validatedData.incharge = JSON.parse(validatedData.incharge);
    validatedData.image && (validatedData.logo = validatedData.image);

    let company;
    if (validatedData.companyId) {
      company = await Company.findByIdAndUpdate(
        validatedData.companyId,
        {
          $set: validatedData,
        },
        { new: true }
      );
    } else {
      company = await Company.create(validatedData);
    }
    const siteComObj = {
      color: validatedData.color,
      trades: validatedData.trades,
      companyId: company._id,
      parentCompanyId: validatedData.parentCompanyId,
    };
    await SiteCompanies.findOneAndUpdate(
      {
        siteId: validatedData.siteId,
      },
      {
        $addToSet: {
          companies: siteComObj,
        },
      }
    );
    res.status(200).send(response(STRINGS.TEXTS.companyAdded, company));
  }

  async getAll(req, res) {
    const result = await Company.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Company.findById(id, { __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);

    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
  }

  async update(req, res) {
    const companyId = req.params.id;

    const validatedData = req.body;
    validatedData.trades = JSON.parse(validatedData.trades);
    validatedData.incharge = JSON.parse(validatedData.incharge);
    validatedData.image && (validatedData.logo = validatedData.image);

    const siteComObj = {
      companyId: companyId,
      color: validatedData.color,
      trades: validatedData.trades,
      parentCompanyId: validatedData.parentCompanyId,
    };

    let company = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: validatedData,
      },
      { new: true }
    );
    await SiteCompanies.findOneAndUpdate(
      {
        siteId: validatedData.siteId,
        "companies.companyId": validatedData.companyId,
      },
      {
        $set: {
          "companies.$": siteComObj,
        },
      }
    );
    res.status(200).send(response(STRINGS.TEXTS.companyUpdated, company));
  }

  async delete(req, res) {
    const id = req.params.id;

    // const result = await Company.findByIdAndDelete(id);

    res.status(200).send(response(STRINGS.TEXTS.compantDeleted, result));
  }

  async getBySite(req, res) {
    const siteId = req.params.siteId;

    let result = await SiteCompanies.findOne({ siteId: siteId })
      .populate("companies.companyId")
      .populate("companies.parentCompanyId");

    result = result.companies || [];

    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async getNonSite(req, res) {
    const siteId = req.params.siteId;

    let siteCompaniesIds = [];
    const siteCompaniesForIds = await SiteCompanies.findOne({ siteId: siteId });
    if (siteCompaniesForIds) {
      siteCompaniesIds = siteCompaniesForIds.companies.map(
        (item) => item.companyId
      );
    }

    let result = await Company.find({
      _id: { $nin: siteCompaniesIds },
    });

    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async addUser(req, res) {
    const body = req.body;

    body["company"] = [body.companyId];
    if (req.file) body["image"] = req.file.path;
    const user = await Auth.signup(body);
    const userId = user.user._id;
    await user.user.update({ $addToSet: { company: body.companyId } });

    body.sites = JSON.parse(body.sites);
    const sitesObj = [];
    body.sites.map((item, index) => {
      const obj = { siteId: item, role: body.userRole };
      sitesObj.push(obj);
    });

    if (user.exists) {
      await UserSites.findOneAndUpdate({
        userId: userId,
        $addToSet: { sites: sitesObj },
        upsert: true,
      });
      await Company.findByIdAndUpdate(
        {
          _id: body.companyId,
        },
        { $addToSet: { users: { userId: userId, role: body.userRole } } },
        { upsert: true }
      );
      res.status(200).send(response(STRINGS.TEXTS.userAdded, user));
    } else {
      await new UserSites({
        userId: userId,
        sites: sitesObj,
      }).save();
      res.status(200).send(response(STRINGS.TEXTS.userAdded, user));
    }
  }

  async getCompanyUsersPerSite(req, res) {
    const siteId = req.params.siteId;
    const companyId = req.params.companyId;
    const result = await SiteCompanies.findOne({
      siteId: siteId,
      users: { $elemMatch: { companyId: ObjectId(companyId) } },
    })
      .populate("users.userId")
      .populate("users.companyId");

    if (!result) throw new CustomError(STRINGS.ERRORS.userNotFound);

    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
  }
}

module.exports = new CompanyController();

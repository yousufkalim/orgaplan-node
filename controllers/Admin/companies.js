const mongoose = require("mongoose");
const Site = require("../../models/site");
const STRINGS = require("../../utils/texts");
const Auth = require("../../controllers/auth");
const Company = require("../../models/company");
const response = require("../../utils/response");
const UserSites = require("../../models/userSites");
const CustomError = require("../../utils/customError");
// const SiteCompanies = require("../../models/siteCompanies");
// delete mongoose.connection.models[STRINGS.MODALS.SITECOMPANIES];
const SiteCompanies = mongoose.model(STRINGS.MODALS.SITECOMPANIES);

class CompanyController {
  async create(req, res) {
    const data = req.body;
    data.incharge = JSON.parse(data.incharge);
    data.trades = JSON.parse(data.trades);
    data.logo = data.image;
    delete data.image;

    // Check if company name exists
    const companyName = await Company.findOne({ name: data.name });
    if (companyName) throw new CustomError(STRINGS.ERRORS.companyAlreadyExists);

    const company = await Company.create({
      logo: data.logo,
      name: data.name,
      color: data.color,
      website: data.website,
      description: data.description,
      quoteVerified: true,
      incharge: {
        firstName: data.incharge.firstName,
        lastName: data.incharge.lastName,
        email: data.incharge.email,
        phone: data.incharge.phone,
      },
    });

    const siteCompanyDoc = await SiteCompanies.findOne({
      siteId: data.siteId,
    });

    if (!siteCompanyDoc) {
      await SiteCompanies.create({
        siteId: data.siteId,
      });
    }
    if (data.isSubcontractor === "true" ? true : false) {
      await SiteCompanies.findOneAndUpdate(
        {
          siteId: data.siteId,
          "companies.companyId": data.parentCompanyId,
        },
        {
          $addToSet: {
            "companies.$.subContractors": company._id,
          },
        }
      );
    } else {
      await SiteCompanies.findOneAndUpdate(
        {
          siteId: data.siteId,
        },
        {
          $addToSet: {
            companies: {
              companyId: company._id,
              trades: data.trades,
            },
          },
        }
      );
    }

    res.status(200).send(response(STRINGS.TEXTS.companyCreated, company));
  }

  async getAll(req, res) {
    const result = await Company.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.companysRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await Company.findOneById(id, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);

    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
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
      // Add user to the sites
      // const userSites = await UserSites.findOne({ userId: userId });
      // const sitesClone = [...userSites.sites];
      // sitesClone.concat(sitesObj);

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

  async getAddCompany(req, res) {
    const siteId = req.params.siteId;
    const result = await Site.findById({ _id: siteId }).populate("trades");

    //   const result = await Company.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound);

    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async getUserCompany(req, res) {
    const id = req.params.id;

    const result = await Company.findOne({ "users.userId": id }).populate(
      "connection.parentCompanyId"
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);

    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
  }

  async getCompanyUsersPerSite(req, res) {
    const siteId = req.params.siteId;
    const companyId = req.params.companyId;

    const result = await Company.findOne({
      _id: companyId,
      "users.siteId": siteId,
    }).populate("users.userId");
    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);

    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (!data.isSubcontractor) {
      const connection = [
        { parentCompanyId: null, isSubContractor: false, siteId: data.siteId },
      ];
      const company = await Company.findOneAndUpdate(
        {
          _id: id,
          "connection.siteId": data.siteId,
        },
        { $set: { connection: [...connection] } },
        { new: true }
      );
      res.status(200).send(response(STRINGS.TEXTS.companyUpdated, company));
    }
    if (data.isSubcontractor) {
      if (data.parentCompanyId == undefined)
        throw new CustomError(STRINGS.ERRORS.parentCompanyNotFound, 404);

      const connection = [
        {
          isSubContractor: true,
          childCompanyId: [],
          siteId: data.siteId,
          parentCompanyId: data.parentCompanyId,
        },
      ];
      const childCompany = await Company.findOneAndUpdate(
        {
          _id: id,
          "connection.siteId": data.siteId,
        },
        { $set: { connection: connection } },
        { new: true }
      );

      const parentCompany = await Company.findOneAndUpdate(
        {
          _id: data.parentCompanyId,
          "connection.siteId": data.siteId,
        },
        { $addToSet: { "connection.$.childCompanyId": childCompany.id } }
      ); //Get parent company id and add child to that company
      res
        .status(200)
        .send(response(STRINGS.TEXTS.companyUpdated, parentCompany));
    }

    // const result = await Company.findByIdAndUpdate(
    //   { _id: id },
    //   { $set: data },
    //   { new: true }
    // );

    // if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound, 404);

    // res.status(200).send(response(STRINGS.TEXTS.companyUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Company.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.compantDeleted, result));
  }
}

module.exports = new CompanyController();

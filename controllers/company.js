const Site = require("../models/site");
const STRINGS = require("../utils/texts");
const Auth = require("../controllers/auth");
const Company = require("../models/company");
const ObjectId = require("mongodb").ObjectID;
const response = require("../utils/response");
const UserSites = require("../models/userSites");
const CustomError = require("../utils/customError");
const SiteCompaniesModel = require("../models/SiteCompanies");

class CompanyController {
  async create(req, res) {
    const validatedData = req.body;
    validatedData.image && (validatedData.logo = validatedData.image);
    validatedData.trades = JSON.parse(validatedData.trades);
    validatedData.incharge = JSON.parse(validatedData.incharge);

    if (validatedData.companyId) {
      if (validatedData.generalContractorId) {
        // Remove pervious general contractor if any exists
        await SiteCompaniesModel.findOneAndUpdate(
          {
            siteId: validatedData.siteId,
            "companies.subContractors": validatedData.companyId,
          },
          {
            $pull: {
              "companies.$.subContractors": validatedData.companyId,
            },
          }
        );
        // Create New General Contrctor
        await SiteCompaniesModel.findOneAndUpdate(
          {
            siteId: validatedData.siteId,
            "companies.companyId": validatedData.generalContractorId,
          },
          {
            $addToSet: {
              "companies.$.subContractors": validatedData.companyId,
            },
          }
        );
        // Update The Company
        const result = await Company.findByIdAndUpdate(
          { _id: validatedData.companyId },
          {
            $set: validatedData,
          }
        );
        res.status(200).send(response(STRINGS.TEXTS.companyUpdated, result));
      } else {
        // Remove pervious general contractor if any exists
        await SiteCompaniesModel.findOneAndUpdate(
          {
            siteId: validatedData.siteId,
            "companies.subContractors": validatedData.companyId,
          },
          {
            $pull: {
              "companies.$.subContractors": validatedData.companyId,
            },
          }
        );
        // Update The Company
        const result = await Company.findByIdAndUpdate(
          { _id: validatedData.companyId },
          {
            $set: validatedData,
          }
        );
        res.status(200).send(response(STRINGS.TEXTS.companyUpdated, result));
      }
    } else {
      const result = await new Company(validatedData).save();

      await SiteCompaniesModel.findOneAndUpdate(
        {
          siteId: validatedData.siteId,
        },
        {
          $addToSet: {
            companies: { companyId: result._id, trades: validatedData.trades },
          },
        }
      );
      if (validatedData.generalContractorId) {
        await SiteCompaniesModel.findOneAndUpdate(
          {
            siteId: validatedData.siteId,
            "companies.companyId": validatedData.generalContractorId,
          },
          {
            $addToSet: {
              "companies.$.subContractors": result._id,
            },
          }
        );
      }
      res.status(200).send(response(STRINGS.TEXTS.companyCreated, result));
    }
  }

  async getAll(req, res) {
    const result = await Company.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Company.findOne({ _id: id }, { password: 0, __v: 0 });
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

  async getBySite(req, res) {
    const siteId = req.params.siteId;
    const result = await Site.findById({ _id: siteId }).populate("trades");

    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound);

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

  async getCompanyUsersPerSite(req, res) {
    const siteId = req.params.siteId;
    const companyId = req.params.companyId;
    const result = await SiteCompaniesModel.findOne({
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

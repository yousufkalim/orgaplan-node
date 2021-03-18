const ObjectId = require("mongodb").ObjectID;
const Company = require("../models/company");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Auth = require("../controllers/auth");
const User = require("../models/user");
const UserSites = require("../models/userSites");
const Site = require("../models/site");
const SiteCompaniesModel = require("../models/SiteCompanies");

class CompanyController {
  async create(req, res) {
    const data = req.body;

    // Check if company name exists

    const companyName = await Company.findOne({ name: data.name });
    if (companyName) throw new CustomError(STRINGS.ERRORS.companyAlreadyAdded);

    if (data.isSubcontractor == "true") {
      if (data.childCompanyId) {
        // if the subcontractor exists
        if (!data.parentCompanyId)
          throw new CustomError(STRINGS.ERRORS.parentCompanyNotFound);

        // If the subcontractor company already exists
        const subcontractor = await Company.findOneAndUpdate(
          {
            _id: data.childCompanyId,
            "connection.siteId": data.siteId,
          },
          {
            $set: { "connection.$.parentCompanyId": data.parentCompanyId },
          }
        );

        const parentCompany = await Company.findOneAndUpdate(
          {
            _id: data.parentCompanyId,
            "connection.siteId": data.siteId,
          },
          { $addToSet: { "connection.$.childCompanyId": data.childCompanyId } }
        ); //Get parent company id and add child to that company
        res
          .status(200)
          .send(response(STRINGS.TEXTS.companyRequested, subcontractor));

        //   const subcontractor = await Company.findOneAndUpdate(
        //     {
        //       _id: data.parentCompanyId,
        //       "connection.siteId": data.siteId,
        //     },
        //     { $addToSet: { "connection.$.childCompanyId": childCompanyId } }
        //   ); //Get parent company id and add child to that company
        //   res
        //     .status(200)
        //     .send(response(STRINGS.TEXTS.companyRequested, childCompany));
        // }
      }
      if (!data.childCompanyId) {
        // It's a sub contractor but the company does not already exists
        if (data.parentCompanyId) {
          const parentCompanyId = data.parentCompanyId;
          const siteId = data.siteId;

          const connection = [
            {
              parentCompanyId: parentCompanyId,
              siteId: siteId,
              isSubContractor: true,
            },
          ];
          data["connection"] = connection;
          if (data.users) data.users = JSON.parse(data.users);
          const childCompany = await Company(data).save(); // Create child company
          const childCompanyId = childCompany._id;

          const parentCompany = await Company.findOneAndUpdate(
            {
              _id: data.parentCompanyId,
              "connection.siteId": data.siteId,
            },
            {
              $addToSet: {
                "connection.$.childCompanyId": childCompanyId,
              },
            }
          ); //Get parent company id and add child to that company

          res
            .status(200)
            .send(response(STRINGS.TEXTS.companyRequested, childCompany));
        }
      }
    }

    if (data.isSubcontractor == "false") {
      // If its the

      if (data.parentCompanyId) {
        // It the company already exists then just assing it a site

        const mainCompany = await Company.findOneAndUpdate(
          {
            _id: data.parentCompanyId,
          },
          { $addToSet: { connection: { siteId: data.siteId } } }
        );

        res
          .status(200)
          .send(response(STRINGS.TEXTS.companyRequested, mainCompany));
      } else {
        if (data.users) data.users = JSON.parse(data.users);
        const connection = [{ siteId: data.siteId, isSubContractor: false }];
        data["connection"] = connection;
        const company = await Company(data).save(); // Create child company
        res.status(200).send(response(STRINGS.TEXTS.companyRequested, company));
      }
    }
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
    // const result = await SiteCompaniesModel.findOne(
    //   {
    //     siteId: siteId,
    //     "companies.companyId": companyId,
    //     "users.companyId": companyId,
    //   },
    //   { companies: { $elemMatch: { companyId: companyId } } },
    //   { users: { $elemMatch: { companyId: companyId } } }
    // )
    //   .populate("companies.companyId")
    //   .populate("users.userId");
    // const result = await SiteCompaniesModel.aggregate([
    //   {
    //     $project: {
    //       siteId: { $cond: [{ $eq: [siteId, siteId] }, 1, 0] },
    //     },
    //   },
    // ]);
    console.log(siteId, companyId);

    let result = await SiteCompaniesModel.aggregate([
      {
        $match: {
          siteId: { $eq: ObjectId(siteId) },
        },
      },
      {
        $project: {
          siteId: 1,
          users: {
            $filter: {
              input: "$users",
              as: "users",
              cond: { $eq: ["$$users.companyId", ObjectId(companyId)] },
            },
          },
          companies: 1,
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "users.userId",
          foreignField: "_id",
          as: "usersArray",
        },
      },
      {
        $lookup: {
          from: Company.collection.name,
          localField: "companies.companyId",
          foreignField: "_id",
          as: "companies",
        },
      },
      {
        $lookup: {
          from: Company.collection.name,
          localField: "users.companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $project: {
          siteId: 1,
          usersArray: 1,
          company: 1,
          companies: 1,
        },
      },
    ]);
    // .aggregate([
    //   {
    //     $lookup: {
    //       from: User.collection.name,
    //       localField: "users.userId",
    //       foreignField: "_id",
    //       as: "user",
    //     },
    //   },
    //   {
    //     $match: { siteId: { $eq: siteId } },
    //   },
    // ]);
    // if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound);

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

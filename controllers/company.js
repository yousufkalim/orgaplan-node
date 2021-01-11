const Company = require("../models/company");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");

class CompanyController {
  async create(req, res) {
    const data = req.body;
    console.log(data.isSubcontractor);
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
            { parentCompanyId: parentCompanyId, siteId: siteId },
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
            { $addToSet: { "connection.$.childCompanyId": childCompanyId } }
          ); //Get parent company id and add child to that company
          res
            .status(200)
            .send(response(STRINGS.TEXTS.companyRequested, childCompany));
        }
      }
    }

    if (data.isSubcontractor == "false") {
      // If its the
      console.log("\n\n\nHERE1");

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
        const connection = [{ siteId: data.siteId }];
        data["connection"] = connection;
        const company = await Company(data).save(); // Create child company
        res.status(200).send(response(STRINGS.TEXTS.companyRequested, company));
      }
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
    if (data.incharge) data.incharge = JSON.parse(data.incharge);
    const result = await Company.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.companyUpdated, result));
  }

  async addUser(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Company.findById({ _id: id });

    if (!result) throw new CustomError(STRINGS.ERRORS.companyNotFound, 404);
    const resultClone = [...result.users];
    if (!data.userId) throw new CustomError(STRINGS.ERRORS.userIdRequired, 404);
    if (!data.role) throw new CustomError(STRINGS.ERRORS.userRoleRequired, 404);

    const usersClone = [...result.users];
    usersClone.push(data);
    result.users = usersClone;
    await result.updateOne(result);
    res.status(200).send(response(STRINGS.TEXTS.userAdded, result));
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

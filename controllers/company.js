const Company = require("../models/company");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
class CompanyController {
  async create(req, res) {
    const data = req.body;
    data.users = JSON.parse(data.users);
    data.incharge = JSON.parse(data.incharge);
    const result = await new Company(data).save();
    res.status(200).send(response(STRINGS.TEXTS.companyRequested, result));
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

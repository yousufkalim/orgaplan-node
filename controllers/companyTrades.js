const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const CompanyTrades = require("../models/companyTrades");
class CompanyTradesController {
  async create(req, res) {
    const result = await new CompanyTrades(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.companyTradeCreated, result));
  }

  async getAll(req, res) {
    const result = await CompanyTrades.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allCompanyTrades, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await CompanyTrades.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.companyTradeNotFound);

    res.status(200).send(response(STRINGS.TEXTS.companyTradeRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await CompanyTrades.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.companyTradeNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.companyTradeUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await CompanyTrades.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.companyTradeDeleted, result));
  }
}
module.exports = new CompanyTradesController();

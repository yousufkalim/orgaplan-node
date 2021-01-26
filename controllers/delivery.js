const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Delivery = require("../models/delivery");
const CompanyTrades = require("../models/companyTrades");
class DeliveryController {
  async create(req, res) {
    const body = req.body;
    if (!body.isExterior) {
      if (!body.level) throw new CustomError(STRINGS.ERRORS.leveRequired);
    }
    const companyTrades = await CompanyTrades.findOne({
      companyId: body.companyId,
      siteId: body.siteId,
      trades: body.trades,
    });
    if (!companyTrades)
      throw new CustomError(STRINGS.ERRORS.invalidCompanyTradeAssign);

    const result = await new Delivery(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.deliveryCreated, result));
  }

  async getAll(req, res) {
    const result = await Delivery.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Delivery.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound);

    res.status(200).send(response(STRINGS.TEXTS.deliveryRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const body = req.body;
    if (!body.isExterior) {
      if (!body.level) throw new CustomError(STRINGS.ERRORS.leveRequired);
    }
    if (body.trades) {
      const companyTrades = await CompanyTrades.findOne({
        companyId: body.companyId,
        siteId: body.siteId,
        trades: body.trades,
      });
      if (!companyTrades)
        throw new CustomError(STRINGS.ERRORS.invalidCompanyTradeAssign);
    }
    const result = await Delivery.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Delivery.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.deliveryDeleted, result));
  }
}
module.exports = new DeliveryController();

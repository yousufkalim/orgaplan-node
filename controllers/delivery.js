const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Delivery = require("../models/delivery");
const Company = require("../models/company");
const CompanyTrades = require("../models/companyTrades");
const DeliveryArea = require("../models/deliveryArea");
const StorageArea = require("../models/storageArea");
const Building = require("../models/building");
const Means = require("../models/mean");
const Location = require("../models/location");
const EmailService = require("../services/mail.service");
var HTMLParser = require("node-html-parser");

class DeliveryController {
  async sendEmail(req, res) {
    const body = req.body;

    res
      .status(200)
      .send(response(STRINGS.TEXTS.deliveryCreated, { sent: "email send" }));
  }

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

    if (body.sendDeliverySummary) {
      await new EmailService().sendDeliverySummaryEmail(
        body.userEmail,
        body.html
      );
    }

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

  async getEnterprise(req, res) {
    const { userId, siteId } = req.params;
    console.log(siteId);
    const userCompany = await Company.findOne({
      "users.userId": userId,
      "users.siteId": siteId,
    })
      .populate({
        path: "connection",
        populate: { path: "parentCompanyId", model: STRINGS.MODALS.COMPANY },
      })
      .populate({
        path: "connection",
        populate: { path: "trades", model: STRINGS.MODALS.TRADES },
      });

    if (!userCompany) throw new CustomError(STRINGS.ERRORS.companyNotFound);
    const userCompanyId = userCompany._id;
    console.log(userCompanyId);
    const siteDeliveryAreas = await DeliveryArea.find({
      siteId: siteId,
    }).populate("means");
    if (!siteDeliveryAreas)
      throw new CustomError(STRINGS.ERRORS.deliveyAreaNotFount);
    const siteStorageAreas = await StorageArea.find({
      siteId: siteId,
      companies: userCompanyId,
    });
    if (!siteStorageAreas)
      throw new CustomError(STRINGS.ERRORS.storageAreaNotFount);
    const siteBuildings = await Building.find({ siteId: siteId });
    const siteLiftingMeans = await Means.find({
      siteId: siteId,
      meanType: STRINGS.MEANTYPES.LIFTING,
    });
    const siteRoutingMeans = await Means.find({
      siteId: siteId,
      meanType: STRINGS.MEANTYPES.ROUTING,
    });
    const siteLocations = await Location.find({
      siteId: siteId,
    })
      .populate("storage")
      .populate("building");
    if (!siteLocations) throw new CustomError(STRINGS.ERRORS.locationNotFound);
    const data = {
      user_company: userCompany,
      site_delivery_areas: siteDeliveryAreas,
      site_storage_areas: siteStorageAreas,
      site_buildings: siteBuildings,
      site_lifting_means: siteLiftingMeans,
      site_routing_means: siteRoutingMeans,
      site_locations: siteLocations,
    };
    res.status(200).send(response(STRINGS.TEXTS.deliveryRequested, data));
    // const result = await Delivery.findOne({ _id: id }, { password: 0, __v: 0 });
    // if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound);

    // res.status(200).send(response(STRINGS.TEXTS.deliveryRequested, result));
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

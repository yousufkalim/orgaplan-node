const STRINGS = require("../utils/texts");
const Validations = require("../validators");
const response = require("../utils/response");
const Delivery = require("../models/delivery");
const CustomError = require("../utils/customError");
const EmailService = require("../services/mail.service");

class DeliveryController {
  async create(req, res) {
    const validatedData = await Validations.delivery.create(req.body);

    const result = await Delivery.create(validatedData);

    // if (body.sendDeliverySummary) {
    //   await new EmailService().sendDeliverySummaryEmail(
    //     body.userEmail,
    //     body.html
    //   );
    // }

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
    const validatedData = await Validations.delivery.update({
      deliveryId: req.params.id,
      ...req.body,
    });

    const result = await Delivery.findByIdAndUpdate(validatedData.deliveryId, {
      $set: validatedData,
    });

    // if (body.sendDeliverySummary) {
    //   await new EmailService().sendDeliverySummaryEmail(
    //     body.userEmail,
    //     body.html
    //   );
    // }

    if (!result) throw new CustomError(STRINGS.ERRORS.error, 400);

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Delivery.findByIdAndDelete(id);

    res.status(200).send(response(STRINGS.TEXTS.deliveryDeleted, result));
  }

  async getSiteAlerts(req, res) {
    const id = req.params.id;

    const result = await Delivery.find({ siteId: id }).populate("deliveryArea");
    // .populate("storageArea")
    // .populate("liftingMeans");
    // console.log("result---------", result);
    const resultData = [];
    result.forEach((element, index) => {
      let data = JSON.parse(JSON.stringify(element));
      if (element.deliveryArea.availability.end) {
        data.deliveryArea["alert"] = {
          alert: true,
          reason: "Near to end date",
        };
        resultData.push(data);
      }
    });
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, resultData));
  }

  async updateStatus(req, res) {
    const id = req.params.id;
    const result = await Delivery.findByIdAndUpdate(
      { _id: id },
      { $set: { status: "VALIDATED" } },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }
}
module.exports = new DeliveryController();

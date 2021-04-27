"use strict";
const STRINGS = require("../utils/texts");
const Validations = require("../validators");
const response = require("../utils/response");
const Delivery = require("../models/delivery");
const CustomError = require("../utils/customError");
const EmailService = require("../services/mail.service");
const moment = require("moment");
const {
  isDateEqualToDate,
  isDateBetweenEndDateAndDateNumber,
} = require("../utils/helpers");

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

    const result = await Delivery.find({ siteId: id })
      .populate("deliveryArea")
      .populate("storageArea")
      .populate("liftingMeans")
      .populate("routingMeans");
    const resultData = [];
    result.forEach((element, index) => {
      let data = JSON.parse(JSON.stringify(element));
      data["alert"] = false;
      if (element.deliveryArea.availability.end) {
        if (
          isDateBetweenEndDateAndDateNumber(
            element.deliveryArea.availability.end,
            element.deliveryArea.notificationPriorToDays
          )
        ) {
          data.deliveryArea["alert"] = {
            reason: "Near to end date",
          };
          data["alert"] = true;
        }
      }
      if (element.storageArea) {
        if (element.storageArea.availability.end) {
          if (
            isDateBetweenEndDateAndDateNumber(
              element.storageArea.availability.end,
              element.storageArea.notificationPriorToDays
            )
          ) {
            data.storageArea["alert"] = [
              {
                alert: true,
                reason: "Near to end date",
              },
            ];

            data["alert"] = true;
          }
        }
        if (element.storageArea.isFull) {
          data["alert"] = true;

          if (data.storageArea.alert) {
            data.storageArea["alert"].push({
              reason: "Storage Area is Full",
            });
          } else {
            data.storageArea["alert"] = [
              {
                reason: "Storage Area is Full",
              },
            ];
          }
        }
      }
      if (element.liftingMeans) {
        element.liftingMeans.map((item, index) => {
          if (isDateEqualToDate(item.availability.end)) {
            data.liftingMeans[index]["alerts"] = {
              reason: "Near to End",
            };

            data["alert"] = true;
          }
        });
      }
      if (element.routingMeans) {
        element.routingMeans.map((item, index) => {
          if (isDateEqualToDate(item.availability.end)) {
            data.routingMeans[index]["alerts"] = {
              reason: "Near to End",
            };

            data["alert"] = true;
          }
        });
      }
      resultData.push(data);
    });
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, resultData));
  }
  async enterpriseDeliveries(req, res) {
    const { siteId, companyId, date } = req.body;
    const secondDate = moment(date).add(1, "days");
    const result = await Delivery.find({
      siteId: siteId,
      companyId: companyId,
      $and: [
        date ? { date: { $gte: new Date(date) } } : {},
        date ? { date: { $lte: new Date(secondDate) } } : {},
      ],
    })
      .populate("companyId")
      .populate("deliveryArea")
      .populate("storageArea");
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
  }
  async trafficAgentDeliveries(req, res) {
    const { siteId, status, date } = req.body;
    const secondDate = moment(date).add(1, "days");
    const result = await Delivery.find({
      siteId: siteId,
      $and: [
        date ? { date: { $gte: new Date(date) } } : {},
        date ? { date: { $lte: new Date(secondDate) } } : {},
        status ? { status: { $eq: status } } : {},
      ],
    })
      .populate("companyId")
      .populate("deliveryArea")
      .populate("storageArea");
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
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

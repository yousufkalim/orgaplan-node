const Joi = require("joi");
const STRINGS = require("../../utils/texts");
const Helpers = require("../../utils/helpers");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required(),
      logo: Joi.string().required(),
      zacId: Joi.string().optional(),
      adminId: Joi.string().required(),
      functionality: Joi.string().required(),
      addresses: Joi.array()
        .items(
          Joi.object().keys({
            street: Joi.string().required(),
            city: Joi.string().required(),
            postal: Joi.string().required(),
          })
        )
        .min(1, "Min one address required"),
      trades: Joi.array().items(Joi.string().optional()),
      penaltyforLateDelivery: Joi.number().integer().min(1).max(9999).messages({
        "number.min": "Min value of 1 required",
        "number.max": "Max value of 1 required",
      }),
      penaltyforUnexpDelivery: Joi.number()
        .integer()
        .min(1)
        .max(9999)
        .messages({
          "number.min": "Min value of 1 required",
          "number.max": "Max value of 1 required",
        }),
      start: Joi.date().required(),
      end: Joi.date().greater(Joi.ref("start")).required(),
      openingHours: Joi.array()
        .items(
          Joi.object().keys({
            day: Joi.number().required(),
            startHour: Joi.number().required(),
            endHour: Joi.number().required(),
          })
        )
        .min(7, "All days are required"),
      unavailabilityDates: Joi.array()
        .items(
          Joi.object().keys({
            date: Joi.date().required(),
            startHour: Joi.number().required(),
            endHour: Joi.number().required(),
            dayOff: Joi.bool().required(),
            reason: Joi.string().optional(),
          })
        )
        .optional(),
      additionalInfo: Joi.string().optional(),
      notificationPriorToDays: Joi.number().allow(""),
      notificationTo: Joi.array().items(Joi.string()),
      // buildings: Joi.array()
      //   .items(
      //     Joi.object().keys({
      //       name: Joi.number().required(),
      //       buildingType: Joi.number().required(),
      //     })
      //   )
      //   .optional(),
      // levels: Joi.array().items(
      //   Joi.object().keys({
      //     name: Joi.string().required(),
      //     number: Joi.number().required(),
      //     levelType: Joi.number().required(),
      //     image: Joi.string().optional(),
      //   })
      // ),
    });

    Helpers.isDateOccuranceChronological(data.start, data.end);

    data.addresses = JSON.parse(data.addresses);
    data.trades = JSON.parse(data.trades);
    data.openingHours = JSON.parse(data.openingHours);
    data.unavailabilityDates = JSON.parse(data.unavailabilityDates);
    data.notificationTo = JSON.parse(data.notificationTo);
    data.logo = data.image;
    delete data.image;

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message);
    }
    return value;
  },
  update: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required(),
      siteId: Joi.string().required(),
      logo: Joi.string().required(),
      zacId: Joi.string().optional(),
      adminId: Joi.string().required(),
      functionality: Joi.string().required(),
      addresses: Joi.array()
        .items(
          Joi.object().keys({
            street: Joi.string().required(),
            city: Joi.string().required(),
            postal: Joi.string().required(),
          })
        )
        .min(1, "Min one address required"),
      trades: Joi.array().items(Joi.string().optional()),
      penaltyforLateDelivery: Joi.number().integer().min(1).max(9999).messages({
        "number.min": "Min value of 1 required",
        "number.max": "Max value of 1 required",
      }),
      penaltyforUnexpDelivery: Joi.number()
        .integer()
        .min(1)
        .max(9999)
        .messages({
          "number.min": "Min value of 1 required",
          "number.max": "Max value of 1 required",
        }),
      start: Joi.date().required(),
      end: Joi.date().greater(Joi.ref("start")).required(),
      openingHours: Joi.array()
        .items(
          Joi.object().keys({
            day: Joi.number().required(),
            startHour: Joi.number().required(),
            endHour: Joi.number().required(),
          })
        )
        .min(7, "All days are required"),
      unavailabilityDates: Joi.array()
        .items(
          Joi.object().keys({
            date: Joi.date().required(),
            startHour: Joi.number().required(),
            endHour: Joi.number().required(),
            dayOff: Joi.bool().required(),
            reason: Joi.string().optional(),
          })
        )
        .optional(),
      additionalInfo: Joi.string().optional(),
      notificationPriorToDays: Joi.number().allow(""),
      notificationTo: Joi.array().items(Joi.string()),
    });

    Helpers.isDateOccuranceChronological(data.start, data.end);

    data.addresses = JSON.parse(data.addresses);
    data.trades = JSON.parse(data.trades);
    data.openingHours = JSON.parse(data.openingHours);
    data.unavailabilityDates = JSON.parse(data.unavailabilityDates);
    data.notificationTo = JSON.parse(data.notificationTo);
    data.logo = data.image;
    delete data.image;

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message);
    }
    return value;
  },
};

module.exports = schemas;

const Joi = require("joi");
const STRINGS = require("../../utils/texts");
const Helpers = require("../../utils/helpers");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email({ tlds: { allow: false } }),
      phone: Joi.number().integer().min(1000000000).max(9999999999).messages({
        "number.min": STRINGS.ERRORS.phoneLength,
        "number.max": STRINGS.ERRORS.phoneLength,
      }),
      contractType: Joi.string()
        .required()
        .valid(
          STRINGS.CONTRACTTYPES.CLIENTPERSITE,
          STRINGS.CONTRACTTYPES.MASTERCLIENT
        ),
    });

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
  update: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email({ tlds: { allow: false } }),
      phone: Joi.number().integer().min(1000000000).max(9999999999).messages({
        "number.min": STRINGS.ERRORS.phoneLength,
        "number.max": STRINGS.ERRORS.phoneLength,
      }),
      contractType: Joi.string()
        .required()
        .valid(
          STRINGS.CONTRACTTYPES.CLIENTPERSITE,
          STRINGS.CONTRACTTYPES.MASTERCLIENT
        ),
    });

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
  verify: (data) => {
    const Validation = Joi.object().keys({
      logo: Joi.string().allow(""),
      color: Joi.string().required(),
      clientId: Joi.string().required(),
      companyId: Joi.string().required(),
      contractType: Joi.string()
        .required()
        .valid(
          STRINGS.CONTRACTTYPES.CLIENTPERSITE,
          STRINGS.CONTRACTTYPES.MASTERCLIENT
        ),
      contractStartDate: Joi.any().when("contractType", {
        is: STRINGS.CONTRACTTYPES.MASTERCLIENT,
        then: Joi.string().required(),
      }),
      contractEndDate: Joi.any().when("contractType", {
        is: STRINGS.CONTRACTTYPES.MASTERCLIENT,
        then: Joi.string().required(),
      }),
      functionality: Joi.string().required(),
      additionalInfo: Joi.string().allow(""),
      notificationPriorToDays: Joi.number().allow(""),
      notificationTo: Joi.array().items(Joi.string()),
      monthlyCost: Joi.any(),
    });

    if (data.contractType === STRINGS.CONTRACTTYPES.MASTERCLIENT) {
      Helpers.isDateOccuranceChronological(
        data.contractStartDate,
        data.contractEndDate
      );
    }

    if (!data.color) data.color = Helpers.randomColor;
    data.notificationTo = JSON.parse(data.notificationTo);
    data.logo = data.image;
    delete data.image;
    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
};

module.exports = schemas;

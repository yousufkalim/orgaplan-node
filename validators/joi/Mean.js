const Joi = require("joi");

const schemas = {
  createMean: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    sheet: Joi.string().required(),
    pricePerHour: Joi.number().required(),
    meanType: Joi.string().required(),
    status: Joi.string().required(),
    availability: Joi.array().items({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
    unavailable: Joi.array().items({
      reason: Joi.string().required(),
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
  }),
};

module.exports = schemas;

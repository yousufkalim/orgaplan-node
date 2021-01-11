const Joi = require("joi");

const schemas = {
  createDeliveryArea: Joi.object().keys({
    name: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    means: Joi.array().items(Joi.string()),
    unavailable: Joi.object().keys({
      reason: Joi.string().required(),
      start: Joi.date().required(),
      end: Joi.date().required(),
      siteId: Joi.string().required(),
    }),
  }),
};

module.exports = schemas;

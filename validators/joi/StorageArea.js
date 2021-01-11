const Joi = require("joi");

const schemas = {
  createStorageArea: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    level: Joi.string().required(),
    location: Joi.string().required(),
    isFull: Joi.bool().required(),
    companies: Joi.array().items(Joi.string().required()),
    materials: Joi.array().items(Joi.string().required()),
    means: Joi.array().items(Joi.string().required()),
    status: Joi.string().required(),
    unavailable: Joi.object().keys({
      reason: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    }),
  }),
};

module.exports = schemas;

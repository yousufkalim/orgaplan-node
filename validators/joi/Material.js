const Joi = require("joi");

const schemas = {
  createMaterial: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.string().required(),
    statusReason: Joi.string().required(),
  }),
};

module.exports = schemas;

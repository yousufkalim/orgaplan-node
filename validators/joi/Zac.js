const Joi = require("joi");

const schemas = {
  createZac: Joi.object().keys({
    name: Joi.string().required(),
    sites: Joi.array().items(Joi.string().required()),
  }),
};

module.exports = schemas;

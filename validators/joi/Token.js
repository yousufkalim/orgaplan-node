const Joi = require("joi");

const schemas = {
  createToken: Joi.object().keys({
    userId: Joi.string().required(),
    token: Joi.string().required(),
    createdAt: Joi.date().required(),
  }),
};

module.exports = schemas;

const Joi = require("joi");

const schemas = {
  createQuote: Joi.object().keys({
    companyName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required(),
    description: Joi.string().required(),
    isPendingResponse: Joi.bool().required(),
    role: Joi.string().required(),
  }),
};

module.exports = schemas;

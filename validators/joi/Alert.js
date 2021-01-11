const Joi = require("joi");

const schemas = {
  createAlert: Joi.object().keys({
    createdBy: Joi.string().required(),
    createdFor: Joi.array().items(Joi.string()).min(1).required(),
    reason: Joi.string().required(),
    location: Joi.string().required(),
  }),
};

module.exports = schemas;

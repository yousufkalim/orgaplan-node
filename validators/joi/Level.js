const Joi = require("joi");

const schemas = {
  createLevel: Joi.object().keys({
    name: Joi.string().required(),
    number: Joi.string().required(),
    levelType: Joi.string().required(),
    storage: Joi.string().required(),
    delivery: Joi.string().required(),
    building: Joi.string().required(),
  }),
};

module.exports = schemas;

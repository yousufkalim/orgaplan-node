const Joi = require("joi");

const schemas = {
  createBuilding: Joi.object().keys({
    name: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    mean: Joi.array().items(Joi.string()),
    levels: Joi.array().items(Joi.string()),
  }),
};

module.exports = schemas;

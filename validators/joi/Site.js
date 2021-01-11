const Joi = require("joi");

const schemas = {
  createSite: Joi.object().keys({
    name: Joi.string().required(),
    logo: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    openingHour: Joi.number().required(),
    closingHour: Joi.number().required(),
    siteEndAlertTime: Joi.number().required(),
    status: Joi.string().required(),
    unavailabilityReason: Joi.string().required(),
    means: Joi.array().items(Joi.string().required()),
    buildings: Joi.array().items(Joi.string().required()),
    addresses: Joi.array().items(Joi.string()),
  }),
};

module.exports = schemas;

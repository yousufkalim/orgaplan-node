const Joi = require("joi");

const schemas = {
  createSiteCompanies: Joi.object().keys({
    siteId: Joi.string().required(),
    companies: Joi.array().items(Joi.string().required()),
  }),
};

module.exports = schemas;

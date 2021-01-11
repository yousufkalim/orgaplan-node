const Joi = require("joi");

const schemas = {
  createUserSites: Joi.object().keys({
    userId: Joi.string().required(),
    sites: Joi.array().items(
      Joi.object().keys({
        siteId: Joi.string().required(),
        role: Joi.string().required(),
      })
    ),
  }),
};

module.exports = schemas;

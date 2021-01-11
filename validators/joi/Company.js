const Joi = require("joi");

const schemas = {
  createCompany: Joi.object().keys({
    logo: Joi.number().required(),
    name: Joi.string().required(),
    color: Joi.string().required(),
    description: Joi.string(),
    isSubContractor: Joi.bool().required(),
    companyId: Joi.string(),
    incharge: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.number().required(),
      email: Joi.string().required(),
    }),
    users: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().required(),
        role: Joi.string().required(),
      })
    ),
  }),
};

module.exports = schemas;

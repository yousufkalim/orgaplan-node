const Joi = require("joi");

const schemas = {
  createUser: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.email().required(),
    password: Joi.string().required(),
    image: Joi.string().required(),
    phone: Joi.number().required(),
    address: Joi.object().keys({
      zip: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      country: Joi.string().required(),
      location: Joi.array().items(Joi.string()).min(2),
    }),
    company: Joi.array().items(Joi.string().required()),
    role: Joi.string().required(),
    isActive: Joi.bool().required(),
    isVerified: Joi.bool().required(),
  }),
};

module.exports = schemas;

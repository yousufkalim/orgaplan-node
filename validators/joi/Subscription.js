const Joi = require("joi");

const schemas = {
  createSubscription: Joi.object().keys({
    name: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    price: Joi.number().required(),
    subscriberID: Joi.string().required(),
    status: Joi.string().required(),
  }),
};

module.exports = schemas;

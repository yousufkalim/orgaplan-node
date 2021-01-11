const Joi = require("joi");

const schemas = {
  createInvoice: Joi.object().keys({
    name: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.string().required(),
    invoiceType: Joi.string().required(),
    information: Joi.array().items({
      name: Joi.string().required(),
      images: Joi.array().items(Joi.string().required()),
      site: Joi.string().required(),
      enterprise: Joi.string().required(),
      comments: Joi.array().items({
        comment: Joi.string().required(),
        userId: Joi.string().required(),
      }),
    }),
  }),
};

module.exports = schemas;

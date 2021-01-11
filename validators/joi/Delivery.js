const Joi = require("joi");

const schemas = {
  createDelivery: Joi.object().keys({
    type: Joi.string().required(),
    enterpriseUser: Joi.array().items(Joi.string()),
    materials: Joi.array().items(Joi.string()),
    means: Joi.array().items(Joi.string()),
    storage: Joi.array().items(Joi.string()),
    delivery: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
    comments: Joi.array().items(
      Joi.object().keys({
        comment: Joi.string(),
        user: Joi.object().keys({
          role: Joi.string().required(),
        }),
      })
    ),
  }),
};

module.exports = schemas;

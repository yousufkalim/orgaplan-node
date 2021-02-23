const Joi = require("joi");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      price: Joi.number().required(),
      createdBy: Joi.string().required(),
      clientId: Joi.string().required(),
      siteId: Joi.string().required(),
      description: Joi.string().optional(),
    });

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message);
    }
    return value;
  },
  update: (data) => {
    const Validation = Joi.object().keys({
      price: Joi.number().required(),
      invoiceId: Joi.string().required(),
      createdBy: Joi.string().required(),
      clientId: Joi.string().required(),
      siteId: Joi.string().required(),
      description: Joi.string().optional(),
    });

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message);
    }
    return value;
  },
};

module.exports = schemas;

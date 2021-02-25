const Joi = require("joi");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required(),
      date: Joi.date().required(),
      time: Joi.string().required(),
      location: Joi.string().required(),
      price: Joi.number().required(),
      invoiceType: Joi.string().required(),
      createdBy: Joi.string().required(),
      information: Joi.array().items({
        userId: Joi.string().required(),
        userName: Joi.string().required(),
        images: Joi.array().items(Joi.string().optional()),
        site: Joi.string().optional(),
        enterprise: Joi.string().optional(),
        comments: Joi.array().items({
          comment: Joi.string().required(),
          userId: Joi.string().required(),
        }),
      }),
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
      name: Joi.string().required(),
      date: Joi.date().required(),
      time: Joi.string().required(),
      location: Joi.string().required(),
      price: Joi.number().required(),
      invoiceType: Joi.string().required(),
      createdBy: Joi.string().required(),
      information: Joi.array().items({
        userId: Joi.string().required(),
        userName: Joi.string().required(),
        images: Joi.array().items(Joi.string().optional()),
        site: Joi.string().optional(),
        enterprise: Joi.string().optional(),
        comments: Joi.array().items({
          comment: Joi.string().required(),
          userId: Joi.string().required(),
        }),
      }),
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

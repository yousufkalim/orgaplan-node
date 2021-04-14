const Joi = require("joi");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      siteId: Joi.string().required(),
      companyId: Joi.string().required(),
      userId: Joi.string().required(),
      deliveryArea: Joi.string().required(),
      storageArea: Joi.string().required(),
      comment: Joi.string().allow(""),
      sendDeliverySummary: Joi.bool().required(),
      userEmail: Joi.string().required(),
      trades: Joi.array().items(Joi.string()).min(1),
      liftingMeans: Joi.array().items(Joi.string()).min(1),
      routingMeans: Joi.array().items(Joi.string()).min(1),
      materials: Joi.array().items(Joi.string()).min(1),
      building: Joi.string().required(),
      level: Joi.string().required(),
      date: Joi.date().required(),
      startTime: Joi.number().integer().required(),
      endTime: Joi.number().integer().required(),
      type: Joi.string().required(),
      status: Joi.string().required(),
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
      siteId: Joi.string().required(),
      companyId: Joi.string().required(),
      userId: Joi.string().required(),
      deliveryArea: Joi.string().required(),
      storageArea: Joi.string().required(),
      comment: Joi.string().allow(""),
      sendDeliverySummary: Joi.bool().required(),
      userEmail: Joi.string().required(),
      trades: Joi.array().items(Joi.string()).min(1),
      liftingMeans: Joi.array().items(Joi.string()).min(1),
      routingMeans: Joi.array().items(Joi.string()).min(1),
      materials: Joi.array().items(Joi.string()).min(1),
      building: Joi.string().required(),
      level: Joi.string().required(),
      date: Joi.date().required(),
      startTime: Joi.number().integer().required(),
      endTime: Joi.number().integer().required(),
      type: Joi.string().required(),
      status: Joi.string().required(),
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

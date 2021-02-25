const Joi = require("joi");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string().required(),
      phone: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      image: Joi.string().required(),
      companyId: Joi.string().required(),
    });

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
  update: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.string().required(),
      phone: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      image: Joi.string().optional(),
      companyId: Joi.string().required(),
    });

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
};

module.exports = schemas;

const Joi = require("joi");
const Helpers = require("../../utils/helpers");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string().required(),
      phone: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      image: Joi.string().required(),
      color: Joi.string().required(),
    });

    if (!data.color) data.color = Helpers.randomColor;

    const { error, value } = Validation.validate(data);
    if (error) throw new CustomError(error);
    return value;
  },
  update: (data) => {
    const Validation = Joi.object().keys({
      userId: Joi.number().required(),
      email: Joi.string().required(),
      phone: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      image: Joi.string().required(),
      color: Joi.string().required(),
    });

    if (!data.color) data.color = Helpers.randomColor;

    data.image = data.image || "";

    const { error, value } = Validation.validate(data);
    if (error) throw new CustomError(error);
    return value;
  },
};

module.exports = schemas;

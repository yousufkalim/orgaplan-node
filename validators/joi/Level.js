const Joi = require("joi");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      number: Joi.number().required(),
      image: Joi.string().allow(""),
      levelType: Joi.string().allow(""),
      building: Joi.string().required(),
    });

    data.image ? data.image : "";

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
      number: Joi.number().required(),
      image: Joi.string().allow(""),
      levelType: Joi.string().required(""),
      levelId: Joi.string().required(),
    });

    data.image ? data.image : "";

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
  updateImage: (data) => {
    const Validation = Joi.object().keys({
      image: Joi.string().required("Image is required"),
      levelId: Joi.string().required("Level ref is required"),
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

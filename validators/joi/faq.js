const Joi = require("joi");
const CustomError = require("../../utils/customError");

const schemas = {
  createQuestion: (data) => {
    
    const Validation = Joi.object().keys({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      createdAt: Joi.date().required()
    }).unknown(true);

    const { error, value } = Validation.validate(data);

    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },

  updateQuestion: (data) => {
    const Validation = Joi.object().keys({
      _id: Joi.string().required(),
      question: Joi.string().required(),
      answer: Joi.string().required(),
    }).unknown(true);

    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },

  createQuestionSolutionStep: (data) => {
    const Validation = Joi.object().keys({
      picture: Joi.string().optional().allow(""),
      text: Joi.string().required(),
    }).unknown(true);
    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },

  updateQuestionSolutionStep: (data) => {
    const Validation = Joi.object().keys({
      _id: Joi.string().required(),
      picture: Joi.string().optional().allow(""),
      text: Joi.string().required(),
    }).unknown(true);
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

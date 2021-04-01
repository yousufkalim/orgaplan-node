const Joi = require("joi");
const CustomError = require("../../utils/customError");

const schemas = {
  createCompanyUser: (data) => {
    const Validation = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.number()
        .integer()
        .custom((value, helper) => {
          if (String(value).startsWith("0") || String(value).length !== 9)
            return helper.message("phone is invalid");
          return value;
        })
        .allow(""),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(""),
      companyId: Joi.string().required(),
      role: Joi.string().required(),
      siteId: Joi.string().required(),
    });
    const { error, value } = Validation.validate(data);
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      throw new CustomError(message, 400);
    }
    return value;
  },
  updateCompanyUser: (data) => {
    const Validation = Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .allow(""),
      userId: Joi.string().required(),
      companyId: Joi.string().optional().allow(""),
      role: Joi.string().optional().allow(""),
      siteId: Joi.string().required(),
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

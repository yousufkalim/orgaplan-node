const Joi = require("joi");
const STRINGS = require("../../utils/texts");
const Helpers = require("../../utils/helpers");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      image: Joi.string().required(),
      companyName: Joi.string().required(),
      companyColor: Joi.string().required(),
      companyResponsibleFirstName: Joi.string().required(),
      companyResponsibleLastName: Joi.string().required(),
      companyResponsibleEmail: Joi.string().required(),
      companyResponsiblePhone: Joi.number().required(),
      typeOfContract: Joi.string()
        .required()
        .valid(
          STRINGS.CONTRACTTYPES.CLIENTPERSITE,
          STRINGS.CONTRACTTYPES.MASTERCLIENT
        ),
      contractStartDate: Joi.alternatives().conditional("typeOfContract", {
        is: STRINGS.CONTRACTTYPES.MASTERCLIENT,
        then: Joi.string().required(),
      }),
      contractEndDate: Joi.alternatives().conditional("typeOfContract", {
        is: STRINGS.CONTRACTTYPES.MASTERCLIENT,
        then: Joi.string().required(),
      }),
      functionalitySubscribed: Joi.string().required(),
      additionalInformation: Joi.string().required(),
      notificationPriorToDays: Joi.number().required(),
      notificationTo: Joi.array().items(Joi.string()),
      monthlyCost: Joi.number().allow(""),
    });

    if (data.typeOfContract === STRINGS.CONTRACTTYPES.MASTERCLIENT) {
      Helpers.isDateOccuranceChronological(
        data.contractStartDate,
        data.contractEndDate
      );
    }

    if (!data.companyColor) {
      data.companyColor = Helpers.randomColor;
    }

    const { error, value } = Validation.validate(data);
    if (error) throw new CustomError(error);
    return value;
  },
};

module.exports = schemas;

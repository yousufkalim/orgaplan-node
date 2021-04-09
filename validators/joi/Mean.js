const Joi = require("joi");
const CustomError = require("../../utils/customError");

const schemas = {
  create: (data) => {
    const Validation = Joi.object().keys({
      name: Joi.string().required(),
      siteId: Joi.string().required(),
      location: Joi.array()
        .items(
          Joi.object().keys({
            deliveryArea: Joi.string().optional().allow(""),
            storageArea: Joi.string().optional().allow(""),
            buildingId: Joi.string().optional().allow(""),
            levelID: Joi.string().optional().allow(""),
            locationType: Joi.string().optional().allow(""),
          })
        )
        .optional()
        .allow(""),
      meanType: Joi.string().required(),
      color: Joi.string().required(),
      picCoordinates: Joi.object()
        .keys({
          x: Joi.number().required(),
          y: Joi.number().required(),
        })
        .optional()
        .allow(""),
      image: Joi.string().optional().allow(""),
      additionalInfo: Joi.string().optional().allow(""),
      sheet: Joi.string().optional().allow(""),
      availability: Joi.object()
        .keys({
          start: Joi.date().required(),
          end: Joi.date().required(),
        })
        .optional()
        .allow(""),
      unavailability: Joi.array()
        .items(
          Joi.object().keys({
            date: Joi.date().required(),
            reason: Joi.string().optional().allow(""),
            startingHour: Joi.number().required(),
            endingHour: Joi.number().required(),
          })
        )
        .optional()
        .allow(""),
      pricePerHour: Joi.number().optional().allow(""),
    });

    data.picCoordinates &&
      (data.picCoordinates = JSON.parse(data.picCoordinates));
    data.availability && (data.availability = JSON.parse(data.availability));
    data.unavailability &&
      (data.unavailability = JSON.parse(data.unavailability));
    data.location && (data.location = JSON.parse(data.location));

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
      companyId: Joi.string().required(),
      type: Joi.string().optional().allow(""),
      photos: Joi.array().optional().allow(""),
      location: Joi.string().optional().allow(""),
      description: Joi.string().optional().allow(""),
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

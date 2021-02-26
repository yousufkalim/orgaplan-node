const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Mean = require("../models/mean");
const moment = require("moment");
class MeanController {
  async create(req, res) {
    const body = req.body;
    if (req.file) {
      body.sheet = req.file.path;
    }
    if (body.location) body.location = JSON.parse(body.location);
    if (!body.availability)
      throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
    if (body.availability) {
      //   isDateChoronological(body.availability.start, body.availability.end);
      body.availability = JSON.parse(body.availability);
      console.log(body.availability.start);

      if (!body.availability.start)
        throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
    }

    if (body.unavailability)
      body.unavailability = JSON.parse(body.unavailability);

    if (body.picCoordinates)
      body.picCoordinates = JSON.parse(body.picCoordinates);
    const result = await new Mean(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.meanCreated, result));
  }

  async getAll(req, res) {
    const result = await Mean.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allMeans, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Mean.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async filterMeans(req, res) {
    const body = req.body;
    const siteId = body.siteId;

    const deliveryArea = body.deliveryArea;
    const storageArea = body.storageArea;
    const location = body.location;
    const level = body.level;
    const type = body.type;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const status = body.status;
    const name = body.name;
    const result = await Mean.find({
      siteId: siteId,
      $and: [
        name ? { name: { $eq: name } } : {},
        type ? { meanType: { $eq: type } } : {},
        body ? { status: { $eq: status } } : {},
        startDate
          ? { "availability.start": { $gte: new Date(startDate) } }
          : {},
        endDate ? { "availability.end": { $lte: new Date(endDate) } } : {},
        deliveryArea ? { "location.deliveryArea": deliveryArea } : {},
        location ? { "location._id": location } : {},
        storageArea ? { "location.storageArea": storageArea } : {},
        // level ? { "location.storageArea.level": level } : {},
        { "availability.start": { $lte: new Date() } },
        { "availability.end": { $gte: new Date() } },
      ],
    })
      .populate({
        path: "location",

        populate: {
          path: "storageArea",

          model: STRINGS.MODALS.STORAGEAREA,

          populate: {
            path: "level",
            model: STRINGS.MODALS.LEVEL,
            match: level ? { _id: { $eq: level } } : {},
          },
        },
      })
      .populate({
        path: "location",
        populate: { path: "deliveryArea", model: STRINGS.MODALS.DELIVERYAREA },
      });
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async getListOfMeans(req, res) {
    const siteId = req.params.siteId;

    const result = await Mean.find({
      siteId: siteId,
      $and: [
        { "availability.start": { $lte: new Date() } },
        { "availability.end": { $gte: new Date() } },
      ],
    })
      .populate({
        path: "location",
        populate: { path: "storageArea", model: STRINGS.MODALS.STORAGEAREA },
      })
      .populate({
        path: "location",
        populate: { path: "deliveryArea", model: STRINGS.MODALS.DELIVERYAREA },
      });
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const body = req.body;

    if (req.file) {
      body.sheet = req.file.path;
    }
    if (body.location) body.location = JSON.parse(body.location);
    if (!body.availability) body.availability = JSON.parse(body.availability);
    if (body.unavailability)
      body.unavailability = JSON.parse(body.unavailability);

    if (body.picCoordinates)
      body.picCoordinates = JSON.parse(body.picCoordinates);
    const result = await Mean.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.meanUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Mean.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.meadDeleted, result));
  }
}
module.exports = new MeanController();

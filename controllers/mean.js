const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Mean = require("../models/mean");
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

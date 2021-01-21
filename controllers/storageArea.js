const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const StorageArea = require("../models/storageArea");
const isDateChoronological = require("../utils/date");

class StorageAreaController {
  async create(req, res) {
    const body = await new StorageArea(req.body).save();
    if (!body.name) throw new CustomError(STRINGS.ERRORS.nameReqyured);

    if (body.location == STRINGS.STATUS.INSIDE && !body.level)
      throw new CustomError(STRINGS.ERRORS.leveRequired);

    if (!body.availability)
      throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
    if (body.availability) {
      isDateChoronological(body.availability.start, body.availability.end);

      if (!body.availability.start)
        throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
    }
    const result = await new StorageArea(body).save();

    res.status(200).send(response(STRINGS.TEXTS.storateAreaCreated, result));
  }

  async getAll(req, res) {
    const result = await StorageArea.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allStorateAreas, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await StorageArea.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.storageAreaNotFount);

    res.status(200).send(response(STRINGS.TEXTS.storateAreaRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await StorageArea.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.storageAreaNotFount, 404);

    res.status(200).send(response(STRINGS.TEXTS.storateAreaUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await StorageArea.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.storateAreaDeleted, result));
  }
}
module.exports = new StorageAreaController();

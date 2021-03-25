const STRINGS = require("../utils/texts");
const SitePic = require("../models/sitePic");
const response = require("../utils/response");
const CustomError = require("../utils/customError");

class SitePicController {
  async create(req, res) {
    const result = await SitePic.create(req.body);
    res.status(200).send(response(STRINGS.TEXTS.picCreated, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await SitePic.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.picNotFound);

    res.status(200).send(response(STRINGS.TEXTS.picRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await SitePic.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.picNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.zacUpdated, result));
  }
}

module.exports = new SitePicController();

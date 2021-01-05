const Site = require("../models/site");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
class SiteController {
  async create(req, res) {
    const result = await new Site(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async getAll(req, res) {
    const result = await Site.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Site.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound);

    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Site.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.siteUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Site.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.siteDeleted, result));
  }
}

module.exports = new SiteController();

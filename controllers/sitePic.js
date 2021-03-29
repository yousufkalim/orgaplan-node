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

    const result = await SitePic.findOne({ _id: id });
    if (!result) throw new CustomError(STRINGS.ERRORS.picNotFound);

    res.status(200).send(response(STRINGS.TEXTS.picRequested, result));
  }

  async getBySite(req, res) {
    const siteId = req.params.siteId;

    const result = await SitePic.findOne({ siteId })
      .populate({
        path: "exteriorBuilding",
        populate: { path: "levels" },
      })
      .populate("shapes.mean")
      .populate({
        path: "shapes.building",
        populate: { path: "levels" },
      })
      .populate("shapes.storageArea")
      .populate("shapes.deliveryArea");

    if (!result) throw new CustomError(STRINGS.ERRORS.picNotFound);

    res.status(200).send(response(STRINGS.TEXTS.picRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await SitePic.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.picNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.picUpdated, result));
  }

  async addShape(req, res) {
    const validatedData = req.body;

    const result = await SitePic.findByIdAndUpdate(
      { _id: validatedData.picId },
      { $addToSet: { shapes: validatedData } },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.error, 404);

    res.status(200).send(response(STRINGS.TEXTS.picUpdated, result));
  }
}

module.exports = new SitePicController();

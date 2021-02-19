const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Location = require("../models/location");
class LocationController {
  async create(req, res) {
    const body = req.body;

    if (!body.locationType)
      throw new CustomError(STRINGS.ERRORS.locationRequired);

    if (body.locationType == STRINGS.LOCATIONTYPE.EXTERIOR) {
      if (!body.address) {
        throw new CustomError(STRINGS.ERRORS.locationAddressRequired);
      }
    }
    if (body.locationType == STRINGS.LOCATIONTYPE.INTERIOR) {
      if (!body.building) {
        throw new CustomError(STRINGS.ERRORS.locationBuildingRequired);
      }
    }
    const result = await new Location(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.locationCreated, result));
  }

  async getAll(req, res) {
    const result = await Location.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allLocations, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Location.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.locationNotFound);

    res.status(200).send(response(STRINGS.TEXTS.locationRequested, result));
  }

  async getBySiteId(req, res) {
    const id = req.params.id;

    const result = await Location.find({ siteId: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.locationNotFound);

    res.status(200).send(response(STRINGS.TEXTS.locationRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Location.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.locationNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.locationUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Location.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.locationDeleted, result));
  }
}
module.exports = new LocationController();

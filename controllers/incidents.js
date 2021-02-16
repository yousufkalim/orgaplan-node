const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const SiteIncidents = require("../models/siteincidents");
const Incidents = require("../models/incidents");
class IncidentsController {
  async create(req, res) {
    const body = req.body;

    if (req.files) {
      let photos = [];
      if (req.files["photos"]) {
        req.files["photos"].map((file) => photos.push(file.path));
        body.photos = photos;
      }

      if (req.files["document"]) {
        body.document = req.files["document"][0].path;
      }
    }
    if (body.location) body.location = JSON.parse(body.location);
    const result = await new Incidents(req.body).save();

    await SiteIncidents.findOneAndUpdate(
      { siteId: body.siteId },
      { $addToSet: { indicents: result._id } },
      { upsert: true, new: true }
    );

    res.status(200).send(response(STRINGS.TEXTS.incidentCreated, result));
  }

  async getAll(req, res) {
    const result = await Incidents.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allIncidents, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Incidents.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.indcidentNotFound);

    res.status(200).send(response(STRINGS.TEXTS.incidentRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;

    const body = req.body;

    if (req.files) {
      let photos = [];
      if (req.files["photos"]) {
        req.files["photos"].map((file) => photos.push(file.path));
        body.photos = photos;
      }

      if (req.files["document"]) {
        body.document = req.files["document"][0].path;
      }
    }
    if (body.location) body.location = JSON.parse(body.location);

    const result = await Incidents.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.indcidentNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.incidentUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Incidents.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.incidentDeleted, result));
  }
}
module.exports = new IncidentsController();

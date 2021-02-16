const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const SiteIncidents = require("../models/siteincidents");
class SiteIncidentsController {
  async create(req, res) {
    const body = req.body;
    const siteIncidents = await SiteIncidents.findOneAndUpdate(
      { siteId: body.siteId },
      { $addToSet: { indicents: body.incidentId } },
      { upsert: true, new: true }
    );

    res
      .status(200)
      .send(response(STRINGS.TEXTS.siteIncidentsCreated, siteIncidents));
  }

  async getAll(req, res) {
    const result = await SiteIncidents.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allSiteIncident, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await SiteIncidents.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.siteIncidentsNotFound);

    res
      .status(200)
      .send(response(STRINGS.TEXTS.siteIncidentsRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await SiteIncidents.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { indicents: data.incidentId } },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.siteIncidentsNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.siteIncidentsUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await SiteIncidents.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.siteIncidentsDeleted, result));
  }
}
module.exports = new SiteIncidentsController();

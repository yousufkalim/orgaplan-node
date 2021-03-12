const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Organigramme = require("../models/organigramme");

class OrganigrammeController {
  async create(req, res) {
    if (req.file) req.body.image = req.file.path;
    const result = await new Organigramme(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.organigrammeCreated, result));
  }

  async getAll(req, res) {
    const result = await Organigramme.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allOrganigramme, result));
  }

  async getBySiteId(req, res) {
    const id = req.params.siteId;

    const result = await Organigramme.find({ siteId: id });
    if (!result) throw new CustomError(STRINGS.ERRORS.organigrammeNotFound);

    res.status(200).send(response(STRINGS.TEXTS.organigrammeRequested, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Organigramme.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.organigrammeNotFound);

    res.status(200).send(response(STRINGS.TEXTS.organigrammeRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    if (req.file) req.body.image = req.file.path;
    const data = req.body;

    const result = await Organigramme.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.organigrammeNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.organigrammeUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Organigramme.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.organigrammeDeleted, result));
  }
}
module.exports = new OrganigrammeController();

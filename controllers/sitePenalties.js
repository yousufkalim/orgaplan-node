const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const SitePenalties = require("../models/sitePenalties");
class SitePenaltiesController {
  async create(req, res) {
    const body = req.body;
    //  if (body.companies) body.companies = JSON.parse(body.companies);
    const result = await new SitePenalties(body).save();
    res.status(200).send(response(STRINGS.TEXTS.sitePenaltyCreated, result));
  }

  async getAll(req, res) {
    const result = await SitePenalties.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allSitePenalties, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await SitePenalties.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.sitePenaltyNotFound);

    res.status(200).send(response(STRINGS.TEXTS.sitePenaltyRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await SitePenalties.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.sitePenaltyNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.sitePenaltyUpdated, result));
  }

  async penaltyCompany(req, res) {
    console.log("HERE");
    const id = req.params.id;
    const body = req.body;
    const penalty = await SitePenalties.findOneAndUpdate(
      { siteId: id },
      {
        $push: {
          companies: [
            { companyId: body.companyId, typeOfPenalty: body.typeOfPenalty },
          ],
        },
      },
      { new: true }
    );
    if (!penalty) throw new CustomError(STRINGS.ERRORS.sitePenaltyNotFound);
    res.status(200).send(response(STRINGS.TEXTS.sitePenaltyUpdated, penalty));
  }

  async changeStatus(req, res) {
    const id = req.params.id;
    const body = req.body;
    const penalty = await SitePenalties.findOneAndUpdate(
      {
        siteId: id,
        "companies.companyId": body.companyId,
      },
      { $set: { "companies.$.isPaid": body.isPaid } },

      { new: true }
    );
    if (!penalty) throw new CustomError(STRINGS.ERRORS.sitePenaltyNotFound);
    res.status(200).send(response(STRINGS.TEXTS.sitePenaltyUpdated, penalty));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await SitePenalties.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.sitePenaltyDeleted, result));
  }
}
module.exports = new SitePenaltiesController();

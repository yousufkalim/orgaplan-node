const UserSites = require("../models/userSites");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
class UserSitesController {
  async create(req, res) {
    const data = req.body;
    let result = null;
    result = await UserSites.findOne({ userId: data.userId });
    if (!result) {
      const userSites = await new UserSites(data).save();
      res
        .status(200)
        .send(response(STRINGS.TEXTS.userSiteRequested, userSites));
    } else {
      if (!data.sites && data.sites.length <= 0) {
        throw new CustomError(STRINGS.ERRORS.userSitesNotFound);
      }
      const sitesClone = [...result.sites];
      console.log(JSON.stringify(sitesClone));
      const site = { siteId: data.sites[0].siteId, role: data.sites[0].role };
      sitesClone.push(site);
      console.log(JSON.stringify(sitesClone, null, 2));
      result.sites = sitesClone;
      await result.updateOne(result);
      res.status(200).send(response(STRINGS.TEXTS.userSiteRequested, result));
    }
  }

  async getAll(req, res) {
    const result = await UserSites.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await UserSites.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.userSitesNotFound);

    res.status(200).send(response(STRINGS.TEXTS.userSiteRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await UserSites.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.userSitesNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.userSitesUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await UserSites.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.userSitesDeleted, result));
  }
}

module.exports = new UserSitesController();

const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const StorageAreaRequest = require("../models/storageAreaRequest");

class StorageAreaRequestController {
  async create(req, res) {
    const {
      siteId,
      companyId,
      userId,
      requestDate,
      startDate,
      endDate,
    } = req.body;
    const result = await StorageAreaRequest.create(req.body);
    res
      .status(200)
      .send(response(STRINGS.TEXTS.storateAreaRequestCreated, result));
  }
  async getSiteRequest(req, res) {
    const siteId = req.params.siteId;
    const result = await StorageAreaRequest.find({ siteId: siteId })
      .populate("companyId")
      .populate("storageAreaId");

    res
      .status(200)
      .send(response(STRINGS.TEXTS.storateAreaRequestCreated, result));
  }

  //   async rejectRequest(req, res) {
  //     const siteId = req.params.siteId;

  //     const result = await StorageAreaRequest.create(req.body);
  //     res
  //       .status(200)
  //       .send(response(STRINGS.TEXTS.storateAreaRequestCreated, result));
  //   }
  //   async acceptRequest(req, res) {
  //     const {
  //       siteId,
  //       companyId,
  //       userId,
  //       requestDate,
  //       startDate,
  //       endDate,
  //     } = req.body;
  //     const result = await StorageAreaRequest.create(req.body);
  //     res
  //       .status(200)
  //       .send(response(STRINGS.TEXTS.storateAreaRequestCreated, result));
  //   }
}
module.exports = new StorageAreaRequestController();

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
    const result = await StorageAreaRequest.find({
      siteId: siteId,
      status: "PENDING",
    })
      .populate("companyId")
      .populate("storageAreaId");

    res
      .status(200)
      .send(response(STRINGS.TEXTS.storateAreaRequestCreated, result));
  }

  async rejectRequest(req, res) {
    const id = req.params.id;
    const storageRequest = await StorageAreaRequest.findOne({ _id: id });

    await storageRequest.update({
      $set: { status: "REJECTED" },
    });

    res.status(200).send(response(STRINGS.TEXTS.storateAreaRequestDeleted));
  }

  async acceptRequest(req, res) {
    console.log("callled");
    // const { companyId, storageAreaRequestId } = req.body;
    // const storageRequest = await StorageAreaRequest.findOne({
    //   _id: storageAreaRequestId,
    //   // status: "PENDING",
    // });

    // console.log("storageRequest", storageRequest);
    // await storageRequest.update({
    //   $set: { status: "ACCEPTED" },
    // });

    res.status(200).send(response(STRINGS.TEXTS.storateAreaRequestDeleted));
  }
}
module.exports = new StorageAreaRequestController();

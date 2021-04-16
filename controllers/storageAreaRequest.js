const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const StorageAreaRequest = require("../models/storageAreaRequest");
const StorageArea = require("../models/storageArea");

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
      status: STRINGS.STORAGEAREAREQUESTSTATUS.PENDING,
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
      $set: { status: STRINGS.STORAGEAREAREQUESTSTATUS.REJECTED },
    });

    res.status(200).send(response(STRINGS.TEXTS.storateAreaRequestRejected));
  }

  async acceptRequest(req, res) {
    const storageAreaRequestId = req.params.id;
    const storageRequest = await StorageAreaRequest.findOne({
      _id: storageAreaRequestId,
      status: STRINGS.STORAGEAREAREQUESTSTATUS.PENDING,
    });
    if (!storageRequest)
      throw new CustomError(STRINGS.ERRORS.storageAreaRequestNotFound);

    const storageArea = await StorageArea.findOne({
      _id: storageRequest.storageAreaId,
    });
    if (!storageArea) throw new CustomError(STRINGS.ERRORS.storageAreaNotFount);
    await storageArea.update({
      $addToSet: { companies: storageRequest.companyId },
    });

    await storageRequest.update({
      $set: { status: STRINGS.STORAGEAREAREQUESTSTATUS.ACCEPTED },
    });

    res.status(200).send(response(STRINGS.TEXTS.storateAreaRequestAccepted));
  }
}
module.exports = new StorageAreaRequestController();

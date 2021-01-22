const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const DeliveryArea = require("../models/deliveryArea");
const isDateChoronological = require("../utils/date");
class DeliveryAreaController {
  async create(req, res) {
    const body = req.body;
    if (!body.name) throw new CustomError(STRINGS.ERRORS.nameReqyured);
    if (req.file) body.document = req.file.path;
    if (!body.availability)
      throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
    if (body.availability) {
      isDateChoronological(body.availability.start, body.availability.end);
      body.availability = JSON.parse(body.availability);

      if (!body.availability.start)
        throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
    }
    if (body.addresses) {
      body.addresses = JSON.parse(body.addresses);
    }
    if (body.vehicles) body.vehicles = JSON.parse(body.vehicles);
    if (body.unavailability)
      body.unavailability = JSON.parse(body.unavailability);

    if (body.picCoordinates)
      body.picCoordinates = JSON.parse(body.picCoordinates);
    let result = null;
    if (body.deliveryAreaId)
      result = await DeliveryArea.findOneAndUpdate(
        { _id: body.deliveryAreaId },
        { $set: body },
        { new: true }
      );
    result = await new DeliveryArea(body).save();
    res.status(200).send(response(STRINGS.TEXTS.deliveryAreaCreated, result));
  }

  async getAll(req, res) {
    const result = await DeliveryArea.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allDeliveryAreas, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await DeliveryArea.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.deliveyAreaNotFount);

    res.status(200).send(response(STRINGS.TEXTS.deliveryAreaRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const body = req.body;
    console.log(JSON.stringify(body), null, 2);
    if (req.file) body.document = req.file.path;
    if (body.availability) body.availability = JSON.parse(body.availability);
    if (body.addresses) body.addresses = JSON.parse(body.addresses);
    if (body.vehicles) body.vehicles = JSON.parse(body.vehicles);
    if (body.unavailability)
      body.unavailability = JSON.parse(body.unavailability);
    if (body.picCoordinates)
      body.picCoordinates = JSON.parse(body.picCoordinates);
    const result = await DeliveryArea.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.deliveyAreaNotFount, 404);

    res.status(200).send(response(STRINGS.TEXTS.deliveryAreaUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await DeliveryArea.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.deliveryAreaDeleted, result));
  }
}
module.exports = new DeliveryAreaController();

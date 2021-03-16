const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Booking = require("../models/meanBooking");
class MeanBookingController {
  async create(req, res) {
    const result = await new Booking(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.meanBookingCreated, result));
  }

  async getAll(req, res) {
    const result = await Booking.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allMeanBookings, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Booking.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.meanBookingNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanBookingRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Booking.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.meanBookingNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.meanBookingUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Booking.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.meanBookingDeleted, result));
  }
}
module.exports = new MeanBookingController();

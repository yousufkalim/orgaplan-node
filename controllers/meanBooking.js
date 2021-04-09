const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Booking = require("../models/meanBooking");
const SiteCompanies = require("../models/SiteCompanies");
const Mean = require("../models/mean");
class MeanBookingController {
  async create(req, res) {
    const result = await new Booking(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.meanBookingCreated, result));
  }

  async getMeanCalendar(req, res) {
    const siteId = req.params.siteId;
    const meanId = req.params.meanId;
    const bookings = await Booking.find({
      siteId: siteId,
      meanId: meanId,
    }).populate("companyId");
    const site_companies = await SiteCompanies.find({
      siteId: siteId,
    }).populate("companies");

    const site_means = await Mean.find({ siteId: siteId });
    let result = { bookings, site_companies, site_means };

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async filterBookingCalendar(req, res) {
    const body = req.body;
    const siteId = body.siteId;
    const meanId = body.meanId;
    const endDate = body.endDate;
    const result = await Booking.find({
      siteId: siteId,
      $and: [
        meanId ? { meanId: { $eq: meanId } } : {},
        endDate ? { endDate: { $eq: endDate } } : {},
      ],
    }).populate("companyId");

    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
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

  async getHistory(req, res) {
    const meanId = req.params.meanId;
    const siteId = req.params.siteId;

    const siteCompanies = await SiteCompanies.findOne({
      siteId: siteId,
    }).populate("companies.companyId");

    const siteMeans = await Mean.find({ siteId: siteId });

    const history = await Booking.find({ siteId: siteId, meanId: meanId })
      .populate("meanId")
      .populate("companyId");
    const result = {
      site_means: siteMeans,
      history,
      site_companies: siteCompanies.companies,
    };
    if (!result) throw new CustomError(STRINGS.ERRORS.meanBookingNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanBookingRequested, result));
  }

  async filterHistory(req, res) {
    const body = req.body;
    const siteId = body.siteId;
    const companyId = body.companyId;
    const meanId = body.meanId;

    const result = await Booking.find({
      siteId: siteId,
      $and: [
        companyId ? { companyId: { $eq: companyId } } : {},
        meanId ? { meanId: { $eq: meanId } } : {},
      ],
    })
      .populate("meanId")
      .populate("companyId");

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
  async getBookingBySiteId(req, res) {
    const siteId = req.params.siteId;
    const bookings = await Booking.find({
      siteId: siteId,
    });
    let result = { bookings };
    res.status(200).send(response(STRINGS.TEXTS.bookingOfSite, result));
  }
  
}
module.exports = new MeanBookingController();

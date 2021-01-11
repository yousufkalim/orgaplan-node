const RequestQuote = require("../models/registrationRequest");
const User = require("../models/user");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const MailService = require("../services/mail.service");
const Company = require("../models/company");
const { param, use } = require("../routes");
class RequestQuoteController {
  async create(req, res) {
    const params = req.body;

    // const result = await new RequestQuote(req.body).save();
    const companyName = params.companyName;
    let companyLogo = null;
    if (req.file) companyLogo = req.file.path;
    const companyColor = params.companyColor;
    const userData = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone,
    };

    // res.status(200).send(response(STRINGS.TEXTS.quoteRequest, result));
    const user = await new User(userData).save();
    const userId = user._id;

    const companyConnection = [];
    companyConnection.push({ inchargeId: userId, color: companyColor });

    const companyData = {
      logo: companyLogo,
      name: companyName,
      connection: companyConnection,
    };
    const company = await new Company(companyData).save();

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $addToSet: { company: company._id },
    });
    const requestedQuote = await RequestQuote({
      companyId: company._id,
      userId: user._id,
      contractStartDate: user.contractStartDate,
      contractEndDate: user.contractEndDate,
      additionalInfo: user.additionalInfo,
    }).save();
    let emailService = new MailService();
    await emailService.sendQuote("Your Quote", updatedUser, requestedQuote);
    res
      .status(200)
      .send(response(STRINGS.TEXTS.qouteRequestQuoteUpdated, updatedUser));
  }

  async getAll(req, res) {
    const result = await RequestQuote.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await RequestQuote.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.quoteRequestNotFound);

    res.status(200).send(response(STRINGS.TEXTS.quoteRequest, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await RequestQuote.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.quoteRequestNotFound, 404);

    res
      .status(200)
      .send(response(STRINGS.TEXTS.qouteRequestQuoteUpdated, result));
  }

  async sendQuote(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await RequestQuote.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.quoteRequestNotFound, 404);
    let emailService = new MailService();
    await emailService.sendQuote("Your Quote", result);
    res
      .status(200)
      .send(response(STRINGS.TEXTS.qouteRequestQuoteUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await RequestQuote.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.quoteRequestDeleted, result));
  }
}

module.exports = new RequestQuoteController();

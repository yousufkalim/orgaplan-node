const Client = require("../models/client");
const User = require("../models/user");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const MailService = require("../services/mail.service");
const Company = require("../models/company");
class ClientController {
  async create(req, res) {
    const params = req.body;
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
    const client = await Client({
      companyId: company._id,
      userId: user._id,
      contractStartDate: user.contractStartDate,
      contractEndDate: user.contractEndDate,
      additionalInfo: user.additionalInfo,
    }).save();
    let emailService = new MailService();
    await emailService.sendEmailToClient("Your Quote", updatedUser, client);
    res.status(200).send(response(STRINGS.TEXTS.clientUpdated, updatedUser));
  }

  async getAll(req, res) {
    const result = await Client.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Client.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    ).populate("userId");
    if (!result) throw new CustomError(STRINGS.ERRORS.clientRequestNotFound);

    res.status(200).send(response(STRINGS.TEXTS.clientRequest, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Client.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.clientRequestNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.clientUpdated, result));
  }

  async sendQuote(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Client.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.clientRequestNotFound, 404);
    let emailService = new MailService();
    await emailService.sendEmailToClient("Your Quote", result);
    res.status(200).send(response(STRINGS.TEXTS.clientUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Client.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.clientDeleted, result));
  }
}

module.exports = new ClientController();

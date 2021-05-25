const Contract = require("../models/contract");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const moment = require("moment");
const MailService = require("../services/mail.service");

class notificationController {
  async send(req, res) {
    let date = moment();
    let emailArray = [];
    const result = await Contract.find({}, { password: 0, __v: 0 }).populate(
      "companyId"
    );

    result.map((key, index) => {
      date.add(key.notificationPriorToDays, "days");
      if (moment(key.contractEndDate).isSame(date, "day")) {
        let obj = {
          firstName: key.companyId.incharge.firstName,
          lastName: key.companyId.incharge.lastName,
          email: key.notificationTo,
        };
        emailArray.push(obj);
      }
      date = moment();
    });

    //send email
    let emailService = new MailService();
    await emailService.sendEmailNotification(emailArray);

    res.status(200).send(response(STRINGS.TEXTS.notification, emailArray));
  }
}

module.exports = new notificationController();

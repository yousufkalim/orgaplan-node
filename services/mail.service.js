const nodemailer = require("nodemailer");
const CustomError = require("./../utils/customError");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const texts = require("../utils/texts");
const { text } = require("body-parser");
const ENV = process.env;

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_HOST,
      auth: {
        user: ENV.MAILER_SENDER_EMAIL,
        pass: ENV.MAILER_PASSWORD,
      },
    });
  }

  async send(from, to, subject, content) {
    from = from || `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    content = content || "Hello world";

    if (!to) throw new CustomError("Recipient is required");
    if (!subject) throw new CustomError("Subject is required");

    // Email Starts
    const filePath = path.join(
      __dirname,
      "./html_templates/resetPassword.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: user.firstName + " " + user.lastName,
      email: email,
      password: generatedPassword,
    };
    const htmlToSend = template(replacements);

    const sent = await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject,
      html: htmlToSend,
    });

    return;
  }

  async sendQuote(subject, user) {
    const from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    //if (!to) throw new CustomError("Recipient is required");
    if (!subject) throw new CustomError("Subject is required");

    // Email Starts
    const filePath = path.join(
      __dirname,
      "../html_templates/requestQuote.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: user.firstName + " " + user.lastName,
      email: user.email,
      action_url: texts.globals.quotaRedirectUrl + user.id,
    };
    const htmlToSend = template(replacements);

    const sent = await this.transporter.sendMail({
      from,
      to: Array.isArray(user.email) ? user.email.join() : user.email,
      subject,
      html: htmlToSend,
    });

    return;
  }
}

module.exports = MailService;

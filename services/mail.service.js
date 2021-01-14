const nodemailer = require("nodemailer");
const CustomError = require("./../utils/customError");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const STRINGS = require("../utils/texts");
const ENV = process.env;

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: ENV.MAILER_HOST,
      auth: {
        user: ENV.MAILER_SENDER_EMAIL,
        pass: ENV.MAILER_PASSWORD,
      },
    });
  }

  async requestEmailVerification(to) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!to) throw new CustomError("Recipient is required");

    // Email Starts
    const filePath = path.join(
      __dirname,
      "../html_templates/requestQuote.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + " " + to.lastName,
      email: to.email,
      link,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject: "Email Verification",
      html: htmlToSend,
    });

    return;
  }

  async sendEmailConfirmation(to) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!to) throw new CustomError("Recipient is required");

    // Email Starts
    const filePath = path.join(
      __dirname,
      "./html_templates/resetPassword.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + " " + to.lastName,
      email: to.email,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject: "Email Verified Successfully",
      html: htmlToSend,
    });

    return;
  }

  async sendQuoteActivation(to) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!to) throw new CustomError("Recipient is required");

    // Email Starts
    const filePath = path.join(
      __dirname,
      "../html_templates/requestQuote.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + " " + to.lastName,
      email: to.email,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject: "Quote activated successfully",
      html: htmlToSend,
    });

    return;
  }

  async requestResetPassword(to, link) {
    if (!to) throw new CustomError("Recipient is required");

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(
      __dirname,
      "./html_templates/resetPassword.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + " " + to.lastName,
      email: to.email,
      link,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject: "Password Reset",
      html: htmlToSend,
    });

    return;
  }

  async sendPasswordResetConfirmation(to) {
    if (!to) throw new CustomError("Recipient is required");

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(
      __dirname,
      "./html_templates/resetPassword.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + " " + to.lastName,
      email: to.email,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject: "Password was reset successfully",
      html: htmlToSend,
    });

    return;
  }

  async sendEmailToClient(subject, user, requestedQuote) {
    const from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!user) throw new CustomError("Recipient is required");
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
      action_url: STRINGS.QUOTEREDIRECT + requestedQuote._id,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(user.email) ? user.email.join() : user.email,
      subject,
      html: htmlToSend,
    });

    return;
  }
}

module.exports = MailService;

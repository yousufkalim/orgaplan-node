const nodemailer = require('nodemailer');
const CustomError = require('./../utils/customError');
const handlebars = require('handlebars');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');
const path = require('path');
const STRINGS = require('../utils/texts');
const ENV = process.env;
const moment = require('moment');

const Delivery = require('../models/delivery');

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
  async completedDeliverySummary(id, body) {
    let delivery = await Delivery.findOne({ _id: id })
      .populate('userId')
      .populate('companyId')
      .populate('deliveryArea')
      .populate('storageArea')
      .populate('liftingMeans')
      .populate('routingMeans')
      .populate('siteId');
    const { userId, companyId, deliveryArea, storageArea, liftingMeans, routingMeans } = delivery;

    let meanLifting = liftingMeans.map((item) => item.name);
    let meanRouting = routingMeans.map((item) => item.name);

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    let to = userId.email;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/completedSummary.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: userId.firstName + ' ' + userId.lastName,
      status:
        delivery.status === 'COMPLETED'
          ? 'Completed'
          : delivery.status === 'COMPLETEDWITHISSUE'
          ? 'Completed With Issues'
          : delivery.status === 'PENDING'
          ? 'Pending'
          : delivery.status === 'VALIDATED'
          ? 'Validated by Admin'
          : 'Incomplete',
      email: userId.email,
      company: companyId.name,
      date: moment(delivery.date).format('DD/MM/YYYY'),
      start: delivery.startTime,
      end: delivery.endTime,
      deliveryArea: deliveryArea.name,
      meanL: meanLifting.length > 0 ? meanLifting.join(', ') : 'N/A',
      storage: storageArea.name,
      meanR: meanRouting.length > 0 ? meanRouting.join(', ') : 'N/A',
      // delay: body.delay === 'true' ? `Delayed till ${body.time}` : 'No',
      delay: body.delay === 'true' ? `Retardé jusqu'à ${body.time}` : 'Non',
      comments: delivery.comment === '' ? 'N/A' : delivery.comment,
      materials: delivery.materials.join(', '),
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: to,
      subject: 'Résumé de votre demande de livraison - Orgaplan',
      html: htmlToSend,
      attachments: [
        {
          // filename and content type is derived from path
          path: delivery.siteId.pdf,
        },
      ],
    });

    return;
  }

  //when superadmin creates a site, then emails added to this site receives this email
  async siteCreationNotiToMailsAddedBySuperAdmin(id, body, email) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/siteCreation.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    const htmlToSend = template('hello World');

    await this.transporter.sendMail({
      from,
      to: email,
      subject: STRINGS.TEXTS.summaryDelivery,
      html: htmlToSend,
    });

    return;
  }

  //when user creates a delivery request, then admins receives reminder email about pending requests daily
  async dailyPendingDeliveryReminder(deliveries, site, emails) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/reminderPendingReq.handlebars');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    const link = `${ENV.CLIENT_URL}/calendar`;

    const replacements = {
      Sitename: site.name,
      deliveries,
      url: link,
    };

    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: emails,
      subject: 'Demandes de livraison en attente',
      html: htmlToSend,
    });

    return;
  }

  //when superadmin creates a site, then emails added to this site receives delievry summary every ttime a delivery request is made on this site
  async completedDeliverySummaryToMailsAddedBySuperAdmin(id, body, email) {
    let delivery = await Delivery.findOne({ _id: id })
      .populate('userId')
      .populate('companyId')
      .populate('deliveryArea')
      .populate('storageArea')
      .populate('liftingMeans')
      .populate('routingMeans');

    const { userId, companyId, deliveryArea, storageArea, liftingMeans, routingMeans } = delivery;

    let meanLifting = liftingMeans.map((item) => item.name);
    let meanRouting = routingMeans.map((item) => item.name);

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/completedSummary.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: userId.firstName + ' ' + userId.lastName,
      status:
        delivery.status === 'COMPLETED'
          ? 'Completed'
          : delivery.status === 'COMPLETEDWITHISSUE'
          ? 'Completed With Issues'
          : delivery.status === 'PENDING'
          ? 'Pending'
          : delivery.status === 'VALIDATED'
          ? 'Validated by Admin'
          : 'Incomplete',
      email: userId.email,
      company: companyId.name,
      date: moment(delivery.date).format('DD/MM/YYYY'),
      start: delivery.startTime,
      end: delivery.endTime,
      deliveryArea: deliveryArea.name,
      meanL: meanLifting.length > 0 ? meanLifting.join(', ') : 'N/A',
      storage: storageArea.name,
      meanR: meanRouting.length > 0 ? meanRouting.join(', ') : 'N/A',
      // delay: body.delay === 'true' ? `Delayed till ${body.time}` : 'No',
      delay: body.delay === 'true' ? `Retardé jusqu'à ${body.time}` : 'Non',
      comments: delivery.comment === '' ? 'N/A' : delivery.comment,
      materials: delivery.materials.join(', '),
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Résumé de votre demande de livraison - Orgaplan',
      html: htmlToSend,
    });

    return;
  }
  //when user (traffic/enterprise user) creates a delivery request on a site, then admins of this site receives this email
  async createDeliveryNotiToSiteAdmins(id, body, email) {
    let delivery = await Delivery.findOne({ _id: id }).populate('userId').populate('siteId');

    const { userId, siteId } = delivery;

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/completedSummaryForSiteAdmins.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: userId.firstName + ' ' + userId.lastName,
      siteName: siteId.name,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Vous avez une nouvelle requête de livraison - Orgaplan',
      html: htmlToSend,
    });

    return;
  }

  //when admin validates a delivery request, that user receives the email (also the emails added in site)
  async validatedDeliveryNoti(id, body, cc) {
    let delivery = await Delivery.findOne({ _id: id })
      .populate('userId')
      .populate('companyId')
      .populate('deliveryArea')
      .populate('storageArea')
      .populate('liftingMeans')
      .populate('routingMeans');

    const { userId, companyId, deliveryArea, storageArea, liftingMeans, routingMeans } = delivery;

    let meanLifting = liftingMeans.map((item) => item.name);
    let meanRouting = routingMeans.map((item) => item.name);

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    let to = userId.email;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/validatedDelivery.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: userId.firstName + ' ' + userId.lastName,
      status:
        delivery.status === 'COMPLETED'
          ? 'Completed'
          : delivery.status === 'COMPLETEDWITHISSUE'
          ? 'Completed With Issues'
          : delivery.status === 'PENDING'
          ? 'Pending'
          : delivery.status === 'VALIDATED'
          ? 'Validated by Admin'
          : 'Incomplete',
      email: userId.email,
      company: companyId.name,
      date: moment(delivery.date).format('DD/MM/YYYY'),
      start: delivery.startTime,
      end: delivery.endTime,
      deliveryArea: deliveryArea.name,
      meanL: meanLifting.length > 0 ? meanLifting.join(', ') : 'N/A',
      storage: storageArea.name,
      meanR: meanRouting.length > 0 ? meanRouting.join(', ') : 'N/A',
      // delay: body.delay === 'true' ? `Delayed till ${body.time}` : 'No',
      delay: body.delay === 'true' ? `Retardé jusqu'à ${body.time}` : 'Non',
      comments: delivery.comment === '' ? 'N/A' : delivery.comment,
      materials: delivery.materials.join(', '),
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: to,
      cc,
      subject: 'Votre demande de livraison est validée - Orgaplan',
      html: htmlToSend,
    });

    return;
  }

  //when admin modifies a delivery request, that user receives the email (also the emails added in site)
  async modifyDeliveryNoti(id, body, cc) {
    let delivery = await Delivery.findOne({ _id: id })
      .populate('userId')
      .populate('companyId')
      .populate('deliveryArea')
      .populate('storageArea')
      .populate('liftingMeans')
      .populate('routingMeans');

    const { userId, companyId, deliveryArea, storageArea, liftingMeans, routingMeans } = delivery;

    let meanLifting = liftingMeans.map((item) => item.name);
    let meanRouting = routingMeans.map((item) => item.name);

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    let to = userId.email;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/modifyDelivery.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: userId.firstName + ' ' + userId.lastName,
      status:
        delivery.status === 'COMPLETED'
          ? 'Completed'
          : delivery.status === 'COMPLETEDWITHISSUE'
          ? 'Completed With Issues'
          : delivery.status === 'PENDING'
          ? 'Pending'
          : delivery.status === 'VALIDATED'
          ? 'Validated by Admin'
          : 'Incomplete',
      email: userId.email,
      company: companyId.name,
      date: moment(delivery.date).format('DD/MM/YYYY'),
      start: delivery.startTime,
      end: delivery.endTime,
      deliveryArea: deliveryArea.name,
      meanL: meanLifting.length > 0 ? meanLifting.join(', ') : 'N/A',
      storage: storageArea.name,
      meanR: meanRouting.length > 0 ? meanRouting.join(', ') : 'N/A',
      // delay: body.delay === 'true' ? `Delayed till ${body.time}` : 'No',
      delay: body.delay === 'true' ? `Retardé jusqu'à ${body.time}` : 'Non',
      comments: delivery.comment === '' ? 'N/A' : delivery.comment,
      materials: delivery.materials.join(', '),
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: to,
      cc,
      subject: 'Votre demande de livraison est modifiée - Orgaplan',
      html: htmlToSend,
    });

    return;
  }

  async requestEmailVerification(to, link) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    if (!to) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestEmailVerification.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + ' ' + to.lastName,
      email: to.email,
      link: link,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to.email) ? to.join() : to.email,
      subject: STRINGS.TEXTS.requestEmailVerificationSubject,
      cc: 'orgaplan@falconit.com.pk',
      html: htmlToSend,
    });

    return;
  }

  async sendEmailConfirmation(to, link) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!to) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(
      __dirname,
      '../html_templates/sendEmailVerificationConfirmation.html'
    );
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + ' ' + to.lastName,
      email: to.email,
      link: link,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to.email) ? to.join() : to.email,
      subject: STRINGS.TEXTS.sendEmailConfirmationSubject,
      html: htmlToSend,
    });

    return;
  }

  async sendDeliverySummaryEmail(email, html) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!email) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/sendDeliverySummary.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlTemplage = handlebars.compile(html);
    const replacements = {
      html: htmlTemplage,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Résumé de votre demande de livraison - Orgaplan',
      html: html,
    });

    return;
  }

  async requestSubscriptionActivation(to) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!to) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestSubscriptionActivation.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + ' ' + to.lastName,
      email: to.email,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to.email) ? to.join() : to.email,
      subject: STRINGS.TEXTS.requestSubscriptionActivationSubject,
      html: htmlToSend,
    });

    return;
  }

  async sendSubscriptionActivationConfirmation(to) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    if (!to) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(
      __dirname,
      '../html_templates/sendSubscriptionActivationConfirmation.html'
    );
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + ' ' + to.lastName,
      email: to.email,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to.email) ? to.join() : to.email,
      subject: STRINGS.TEXTS.sendSubscriptionActivationConfirmationSubject,
      html: htmlToSend,
    });

    return;
  }

  async requestResetPassword(to, link) {
    if (!to) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestResetPassword.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + ' ' + to.lastName,
      email: to.email,
      link: link,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to.email) ? to.join() : to.email,
      subject: STRINGS.TEXTS.requestResetPasswordSubject,
      html: htmlToSend,
    });

    return;
  }

  async sendPasswordResetConfirmation(to, link) {
    if (!to) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/sendPasswordResetConfirmation.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: to.firstName + ' ' + to.lastName,
      email: to.email,
      link,
    };
    const htmlToSend = template(replacements);

    await this.transporter.sendMail({
      from,
      to: Array.isArray(to.email) ? to.join() : to.email,
      subject: STRINGS.TEXTS.sendPasswordResetConfirmationSubject,
      html: htmlToSend,
    });

    return;
  }

  async sendEmailClientNotification(emailArray) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    if (!emailArray) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestClientNotification.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    emailArray.map(async (key, index) => {
      key.email.map(async (email, emailIndex) => {
        const replacements = {
          name: key.firstName + ' ' + key.lastName,
          email: email,
        };
        const htmlToSend = template(replacements);

        await this.transporter.sendMail({
          from,
          to: email,
          subject: STRINGS.TEXTS.requestEmailClientSubject,
          html: htmlToSend,
        });
      });
    });
    return;
  }

  async sendEmailSiteNotification(emailArray) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    if (!emailArray) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestSiteNotification.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    emailArray.map(async (key, index) => {
      key.email.map(async (email, emailIndex) => {
        const replacements = {
          name: key.name,
          email: email,
        };
        const htmlToSend = template(replacements);

        await this.transporter.sendMail({
          from,
          to: email,
          subject: STRINGS.TEXTS.requestEmailSubject,
          html: htmlToSend,
        });
      });
    });
    return;
  }
  async sendEmailStorageAreaNotification(emailArray) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    if (!emailArray) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestStorageAreaNotification.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    emailArray.map(async (key, index) => {
      key.email.map(async (email, emailIndex) => {
        const replacements = {
          name: key.name,
          email: email,
        };
        const htmlToSend = template(replacements);

        await this.transporter.sendMail({
          from,
          to: email,
          subject: STRINGS.TEXTS.requestEmailSubject,
          html: htmlToSend,
        });
      });
    });
    return;
  }

  async sendEmailDeliveryAreaNotification(emailArray) {
    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    if (!emailArray) throw new CustomError(STRINGS.ERRORS.recipientRequired);

    // Email Starts
    const filePath = path.join(__dirname, '../html_templates/requestDeliveryAreaNotification.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);

    emailArray.map(async (key, index) => {
      key.email.map(async (email, emailIndex) => {
        const replacements = {
          name: key.name,
          email: email,
        };
        const htmlToSend = template(replacements);

        await this.transporter.sendMail({
          from,
          to: email,
          subject: STRINGS.TEXTS.requestEmailSubject,
          html: htmlToSend,
        });
      });
    });
    return;
  }
  async sendEmailDeliveryReqDeleted(reqToDelEmail, siteName, deliveryDate, startDate, endDate, cc) {
    // let delivery = await Delivery.findOne({ _id: reqToDel }).populate('userId');

    let from = `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    await this.transporter.sendMail({
      from,
      to: reqToDelEmail,
      subject: 'Requête de livraison refusée',
      cc,
      html: `<p>La requête de livraison effectuée pour le chantier ${siteName} pour le ${moment(
        deliveryDate
      ).format(
        'DD/MM/YYYY'
      )} entre ${startDate} et ${endDate} a été refusée par l'administrateur.</p><br><p>Orgaplan</p>`,
    });
    //deliveryDate.toLocaleString(
    //   [],
    //   { dateStyle: 'short' }
    // )

    return;
  }
}

module.exports = MailService;

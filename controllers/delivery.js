'use strict';

const STRINGS = require('../utils/texts');
const Validations = require('../validators');
const mongoose = require('mongoose');
const response = require('../utils/response');
const Delivery = require('../models/delivery');
const StroageArea = require('../models/storageArea');
const Incidents = require('../models/incidents');
const Booking = require('../models/meanBooking');
const CustomError = require('../utils/customError');
const { writeLog } = require('../utils/logs');
const Site = require('../models/site');
const Company = require('../models/company');
const SiteCompanies = require('../models/siteCompanies');
const User = require('../models/user');
const UserSites = require('../models/userSites');

const MailService = require('../services/mail.service');
const moment = require('moment');

class DeliveryController {
  async create(req, res) {
    const validatedData = await Validations.delivery.create(req.body);
    const result = await Delivery.create(validatedData);

    let means = validatedData.liftingMeans.concat(validatedData.routingMeans);
    let meanBookings = [];
    await Promise.all(
      means.map(async (mean) => {
        var data = {
          status:
            validatedData.status === 'COMPLETEDWITHISSUE' ? 'VALIDATED' : validatedData.status,
          startDate: validatedData.sDate,
          endDate: validatedData.eDate,
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          bookingReason: validatedData.comment,
          siteId: validatedData.siteId,
          userId: validatedData.userId,
          companyId: validatedData.companyId,
          meanId: mean,
          deliveryId: result._id,
        };
        let rss = await new Booking(data).save();
        meanBookings.push(rss._id);
      })
    );

    validatedData.meanBookings = meanBookings;

    // if (body.sendDeliverySummary) {
    //   await new EmailService().sendDeliverySummaryEmail(
    //     body.userEmail,
    //     body.html
    //   );
    // }

    // Logging Activity
    const user = await User.findOne({ _id: result.userId });
    const { firstName, lastName } = user;
    const siteData = await Site.findOne({ _id: result.siteId });
    const company = await Company.findOne({ _id: result.companyId });

    if (result.sendDeliverySummary) {
      let emailService = new MailService();
      await emailService.completedDeliverySummary(result._id, req.body);
    }

    let site = await Site.findById(result.siteId);

    if (site.notificationTo.length > 0) {
      let emailService = new MailService();

      site.notificationTo.map(async (email) => {
        await emailService.completedDeliverySummaryToMailsAddedBySuperAdmin(
          result._id,
          req.body,
          email
        );
      });
    }

    let usersites = await UserSites.find({
      sites: {
        siteId: result.siteId,
        role: 'ADMIN',
      },
    }).populate('userId');

    let emailService = new MailService();
    usersites.map(async (site) => {
      await emailService.createDeliveryNotiToSiteAdmins(result._id, req.body, site.userId?.email);
    });

    await writeLog(
      // name
      `${firstName} ${lastName}`,
      //date
      moment().format('DD/MM/YYYY'),
      //description
      `Une demande de livraison a été créée par le ${firstName} ${lastName} pour ${result.date.toLocaleString()}, pour ${
        company.name
      }, pour ${siteData.name}`
    );

    res.status(200).send(response(STRINGS.TEXTS.deliveryCreated, result));
  }

  async getAll(req, res) {
    const result = await Delivery.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Delivery.findOne({ _id: id }, { password: 0, __v: 0 })
      .populate('companyId')
      .populate('storageArea')
      .populate('deliveryArea')
      .populate('liftingMeans')
      .populate('routingMeans');
    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound);

    res.status(200).send(response(STRINGS.TEXTS.deliveryRequested, result));
  }

  async update(req, res) {
    const validatedData = await Validations.delivery.update({
      deliveryId: req.params.id,
      ...req.body,
    });
    delete validatedData.userId;

    const result = await Delivery.findByIdAndUpdate(validatedData.deliveryId, validatedData);
    //adding notification email when admin modifies the delivery request for the user

    let adminEmailsM = await UserSites.find({
      sites: {
        siteId: result.siteId,
        role: 'ADMIN',
      },
    }).populate('userId');
    adminEmailsM = adminEmailsM.map((site) => site.userId.email);
    const siteData = await Site.findOne({ _id: result.siteId });
    let notiMails = siteData.notificationTo;

    if (notiMails.length > 0) {
      adminEmailsM = notiMails.concat(adminEmailsM);
    }

    let emailService = new MailService();
    await emailService.modifyDeliveryNoti(result._id, req.body, adminEmailsM.toString());

    if (!result) throw new CustomError(STRINGS.ERRORS.error, 400);

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const reqToDel = await Delivery.findById(id).populate('userId');

    const result = await Delivery.findByIdAndDelete(id).populate('siteId');

    // to delete mean booking
    await Booking.deleteMany({ _id: { $in: result.meanBookings } });

    // to send email to all admins and enterprise
    let adminEmailsNoti = await UserSites.find({
      sites: {
        siteId: result.siteId,
        role: 'ADMIN',
      },
    }).populate('userId');
    adminEmailsNoti = adminEmailsNoti.map((site) => site.userId.email);

    const siteData = await Site.findOne({ _id: result.siteId });
    let notiMails = siteData.notificationTo;
    if (notiMails.length > 0) {
      adminEmailsNoti = notiMails.concat(adminEmailsNoti);
    }

    let emailService = new MailService();
    await emailService.sendEmailDeliveryReqDeleted(
      reqToDel.userId.email,
      result.siteId.name,
      result.date,
      result.startTime,
      result.endTime,
      adminEmailsNoti.toString()
    );

    // Logging Activity
    const company = await Company.findOne({ _id: result.companyId });
    await writeLog(
      // name
      `${req.user.firstName} ${req.user.lastName}`,
      //date
      moment(new Date()).format('DD/MM/YYYY'),
      `L'administrateur a refusé une demande de livraison pour ${result.date.toLocaleString()}, pour ${
        company.name
      }, pour ${siteData.name}`
    );

    res.status(200).send(response(STRINGS.TEXTS.deliveryDeleted, result));
  }

  async enterpriseDeliveries(req, res) {
    const { siteId, companyId, date } = req.body;
    const secondDate = moment(date).add(1, 'days');
    const result = await Delivery.find({
      siteId: siteId,
      companyId: companyId,
      $and: [
        date ? { date: { $gte: new Date(date) } } : {},
        date ? { date: { $lte: new Date(secondDate) } } : {},
      ],
    })
      .populate('companyId')
      .populate('deliveryArea')
      .populate('storageArea');
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
  }

  async trafficAgentDeliveries(req, res) {
    const {
      siteId,
      date, // YYYY-MM-DD
      companyId,
      locationType,
      location,
      status,
    } = req.query;

    let query = {
      siteId: siteId,
      status: { $ne: STRINGS.STATUS.PENDING },
    };
    status && (query.status = status);
    companyId && (query.companyId = companyId);
    locationType && location && (query[locationType] = location);
    date &&
      (query.date = {
        $gte: new Date(`${date}T00:00:00.000+00:00`),
        $lte: new Date(`${moment(date).add(1, 'day').format('YYYY-MM-DD')}T00:00:00.000+00:00`),
      });

    const result = await Delivery.find(query)
      .populate('companyId')
      .populate('liftingMeans')
      .populate('routingMeans')
      .populate('deliveryArea')
      .populate('storageArea');
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
  }

  async enterpiseDeliveries(req, res) {
    const {
      siteId,
      date, // YYYY-MM-DD
      companyId,
      locationType,
      location,
      status,
    } = req.query;

    let query = {
      siteId: siteId,
    };
    status && (query.status = status);
    companyId && (query.companyId = companyId);
    locationType && location && (query[locationType] = location);
    date &&
      (query.date = {
        $gte: new Date(`${date}T00:00:00.000+00:00`),
        $lte: new Date(`${moment(date).add(1, 'day').format('YYYY-MM-DD')}T00:00:00.000+00:00`),
      });

    const result = await Delivery.find(query)
      .populate('companyId')
      .populate('liftingMeans')
      .populate('routingMeans')
      .populate('deliveryArea')
      .populate('storageArea');
    res.status(200).send(response(STRINGS.TEXTS.allDeliveries, result));
  }

  async updateStatus(req, res) {
    const id = req.params.id;
    const result = await Delivery.findByIdAndUpdate(
      { _id: id },
      { $set: { status: 'VALIDATED' } },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound, 404);

    // Logging Activity
    const siteData = await Site.findOne({ _id: result.siteId });
    const company = await Company.findOne({ _id: result.companyId });
    let adminEmails = await UserSites.find({
      sites: {
        siteId: result.siteId,
        role: 'ADMIN',
      },
    }).populate('userId');
    adminEmails = adminEmails.map((site) => site.userId.email);

    console.log('adminEmails', adminEmails);
    let emailService = new MailService();

    let notiMails = siteData.notificationTo;
    console.log('notiMails', notiMails);

    if (notiMails.length > 0) {
      adminEmails = notiMails.concat(adminEmails);
      console.log('COncated', adminEmails);
    }

    await emailService.validatedDeliveryNoti(result._id, req.body, adminEmails.toString());

    await writeLog(
      // name
      `${req.user.firstName} ${req.user.lastName}`,
      //date
      moment().format('DD/MM/YYYY'),
      `L'administrateur a accepté une demande de livraison pour
      ${result.date.toLocaleString()}, pour ${company.name}, pour ${siteData.name}`
    );

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }

  async completeDelivery(req, res) {
    const id = req.params.id;
    const validatedData = await Validations.delivery.complete({
      deliveryId: id,
      ...req.body,
    });
    const result = await Delivery.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          verifiedBy: validatedData.verifiedBy,
          status: validatedData.status,
          materialsDelivered: validatedData.materialsDelivered,
        },
      },
      {
        new: true,
      }
    );
    if (result.sendDeliverySummary) {
      let emailService = new MailService();
      await emailService.completedDeliverySummary(id, req.body);
    }

    if (validatedData.delay) {
      if (validatedData.image) {
        validatedData.photos = [validatedData.image];
        delete validatedData.image;
      }
      /*
      ===================
      This code block is disabled by humza because he is calling the api for this job directly from frontend
      ===================
      */
      // await Incidents.create({
      //   name: result.name,
      //   date: result.date,
      //   time: validatedData.time,
      //   comment: validatedData.comment,
      //   isBillable: true,
      //   isPaid: false,
      //   location: {
      //     deliveryArea: result.deliveryArea,
      //     storageArea: result.storageArea,
      //   },
      //   photos: validatedData.photos,
      //   siteId: result.siteId,
      //   companyId: result.companyId,
      //   type: STRINGS.INCIDENTTYPE.DELAY,
      // });
    }

    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound, 404);

    // Logging Activity
    const siteData = await Site.findOne({ _id: result.siteId });
    const company = await Company.findOne({ _id: result.companyId });

    await writeLog(
      // name
      validatedData.username,
      //date
      moment().format('DD/MM/YYYY'),
      `L'agent de trafic
      ${validatedData.username} a terminé la livraison pour
      ${result.date.toLocaleString()}, pour ${company.name}, pour ${siteData.name}`
    );

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }

  async bufferUpdateDelivery(req, res) {
    const id = req.params.id;

    const validatedData = req.body;

    const result = await Delivery.findByIdAndUpdate(
      { _id: id },
      {
        $set: validatedData,
      },
      {
        new: true,
      }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.deliveryNotFound, 404);

    // Logging Activity
    if (validatedData.bufferArea) {
      const siteData = await Site.findOne({ _id: result.siteId });
      await writeLog(
        // name
        `${req.user.firstName} ${req.user.lastName}`,
        //date
        moment().format('DD/MM/YYYY'),
        `Camion ${result.flatRegistration} est retourné dans la zone tampon à
        ${result.arrivalTime.toLocaleString()} pour chantier
        ${siteData.name}`
      );
    }

    res.status(200).send(response(STRINGS.TEXTS.deliveryUpdated, result));
  }

  async getDeliveryAllStroageArea(req, res) {
    const siteId = req.params.siteId;
    const deliveryId = req.params.deliveryId;
    const result = await StroageArea.find({
      $and: [{ deliveryArea: deliveryId }, { siteId: siteId }],
    });
    res.status(200).send(response(STRINGS.TEXTS.getDeliveryAllStorageArea, result));
  }

  async getValidatedDeliveryMean(req, res) {
    const result = await Delivery.find({
      status: 'VALIDATED',
    }).populate('companyId');
    res.status(200).send(response(STRINGS.TEXTS.getValidatedDeliveryMean, result));
  }
  async getValidatedDeliveryMeanbySiteandMean(req, res) {
    const siteId = req.params.siteId;
    const meanId = req.params.meanId;
    const result = await Delivery.find({
      $and: [
        { siteId: siteId },
        {
          status: 'VALIDATED',
        },
        {
          $or: [{ liftingMeans: meanId }, { routingMeans: meanId }],
        },
      ],
    }).populate('companyId');
    res.status(200).send(response(STRINGS.TEXTS.getValidatedDeliveryMean, result));
  }
}

module.exports = new DeliveryController();

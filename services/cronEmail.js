/**
 * Cronjob to send reminder to all admins of site each every morning about pending delivery requests, runs at 9 AM
 * @author Arooj Ishfaq
 */
const nodemailer = require('nodemailer');
const CustomError = require('./../utils/customError');
const handlebars = require('handlebars');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');
const path = require('path');
const STRINGS = require('../utils/texts');
const ENV = process.env;
const Delivery = require('../models/delivery');
const Site = require('../models/site');
const cron = require('node-cron');
const mongoose = require('mongoose');
const MailService = require('../services/mail.service');
const User = require('../models/user');

let transporter = nodemailer.createTransport({
  service: ENV.MAILER_HOST,
  auth: {
    user: ENV.MAILER_SENDER_EMAIL,
    pass: ENV.MAILER_PASSWORD,
  },
});
transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.handlebars',
      partialsDir: path.resolve(__dirname, 'html_templates'),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, 'html_templates'),
    extName: '.handlebars',
  })
);
cron.schedule(
  '00 9 * * *',

  async () => {
    let allDeliveries = await Delivery.find({ status: 'PENDING' }).populate('companyId');
    let deliveryIds = allDeliveries.map((a) => mongoose.Types.ObjectId(a.siteId));
    let sites = await Site.aggregate([
      {
        $match: {
          _id: {
            $in: deliveryIds,
          },
        },
      },
      {
        $lookup: {
          from: Delivery.collection.name,
          localField: '_id',
          foreignField: 'siteId',
          as: 'deliveries',
        },
      },
      {
        $addFields: {
          deliveries: {
            $filter: {
              input: '$deliveries',
              as: 'delivery',
              cond: {
                $eq: ['$$delivery.status', STRINGS.STATUS.PENDING],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: 'clientAdmin.adminId',
          foreignField: '_id',
          as: 'admins',
        },
      },
    ]);

    sites.map((site) => {
      let emails = site.admins.map((_) => _.email);

      let { deliveries } = site;
      let filteredDeliveries = [];
      deliveries.map((a) => {
        let deliveryDate = new Date(a.date).setHours(a.endTime.split(':')[0]);
        let currentDate = new Date().setHours(9);
        if (deliveryDate >= currentDate) {
          filteredDeliveries.push({
            ...a,
            date: a.date.toLocaleDateString('en-GB'),
            companyName: allDeliveries.find((b) => b._id.toString() === a._id.toString())?.companyId
              ?.name,
          });
        }
      });
      let emailService = new MailService();
      filteredDeliveries.length >= 1
        ? emailService.dailyPendingDeliveryReminder(filteredDeliveries, site, emails)
        : '';
    });
  },
  {
    scheduled: true,
    timezone: 'Europe/Paris',
  }
);

const Subscription = require("../models/subscription");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const moment = require("moment");
class SubscriptionController {
  async create(req, res) {
    const request = req.body;
    const subscription = await Subscription.findOne({
      email: request.email,
    });
    if (!subscription) {
      // const subscriptionStartDate = moment();
      // const subscriptionEndDate = moment(subscriptionStartDate).add(1, "M");
      // request["startDate"] = subscriptionStartDate.format(STRINGS.FORMATS.DATE);
      // request["endDate"] = subscriptionEndDate.format(STRINGS.FORMATS.DATE);
      const result = await new Subscription(req.body).save();
      res
        .status(200)
        .send(response(STRINGS.TEXTS.subscriptonRequested, result));
    } else {
      // If user  alreay subscribed create a subscription
      if (subscription.status == STRINGS.STATUS.PENDING)
        throw new CustomError(STRINGS.ERRORS.subscriptionPending);
      if (subscription.status == STRINGS.STATUS.ACTIVE)
        throw new CustomError(STRINGS.ERRORS.alreadySubscribed);
      if (subscription.status == STRINGS.STATUS.INACTIVE) {
        const updatedSubscription = await subscription.update({
          status: STRINGS.STATUS.PENDING,
        });
        res
          .status(200)
          .send(
            response(STRINGS.TEXTS.subscriptonRequested, updatedSubscription)
          );
      } else {
        // make subscription request
        const result = await new Subscription(req.body).update();
        res
          .status(200)
          .send(response(STRINGS.TEXTS.subscriptonRequested, result));
      }
      // const endDate = subscription.endDate;
      // if (moment(endDate).isBefore(moment())) {
      //   // Check if subscription has expired then renew subscription
      //   const subscriptionStartDate = moment();
      //   const subscriptionEndDate = moment(subscriptionStartDate).add(1, "M");
      //   subscription.startDate = subscriptionStartDate.format(
      //     STRINGS.FORMATS.DATE
      //   );
      //   subscription.endDate = subscriptionEndDate.format(
      //     STRINGS.FORMATS.DATE
      //   );
      //   const updatedSubscription = await subscription.updateOne(
      //     subscription
      //   );
    }
  }

  async getAll(req, res) {
    const result = await Subscription.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getActiveSubscriptions(req, res) {
    const result = await Subscription.find(
      { status: STRINGS.STATUS.ACTIVE },
      { password: 0, __v: 0 }
    );
    res
      .status(200)
      .send(response(STRINGS.TEXTS.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const subscriptionId = req.params.subscriptionId;

    const result = await Subscription.findOne(
      { _id: subscriptionId },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.subscriptionNotFound);

    res.status(200).send(response(STRINGS.TEXTS.subscriptonRequested, result));
  }

  async update(req, res) {
    const subscriptionId = req.params.subscriptionId;
    const data = req.body;

    const result = await Subscription.findByIdAndUpdate(
      { _id: subscriptionId },
      { $set: data },
      { new: true }
    );

    if (!result)
      throw new CustomError(STRINGS.ERRORS.subscriptionNotFound, 404);

    res
      .status(200)
      .send(response(STRINGS.TEXTS.qouteRequestQuoteUpdated, result));
  }

  async activateSubscription(req, res) {
    const subscriptionId = req.params.subscriptionId;

    let subscription = await Subscription.findById(subscriptionId);

    if (!subscription)
      throw new CustomError(STRINGS.ERRORS.subscriptionNotFound);
    if (subscription.status == STRINGS.STATUS.PENDING) {
      const startDate = moment();
      const endDate = moment().add(1, "M");

      // Change status when end date approaches
      setTimeout(async () => {
        await Subscription.findByIdAndUpdate(subscriptionId, {
          status: STRINGS.STATUS.INACTIVE,
        });
      }, moment(subscription.endDate).diff(moment()));
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.status = STRINGS.STATUS.ACTIVE;
      subscription = await subscription.updateOne(subscription);
      res
        .status(200)
        .send(response(STRINGS.TEXTS.subscriptionStatusChanged, subscription));
    }
    if (subscription.status == STRINGS.STATUS.ACTIVE) {
      throw new CustomError(STRINGS.ERRORS.alreadySubscribed);
    }
    if (subscription.status == STRINGS.STATUS.INACTIVE) {
      throw new CustomError(STRINGS.ERRORS.subscriptionExpired);
    }
  }

  async delete(req, res) {
    const subscriptionId = req.params.subscriptionId;

    const result = await Subscription.findOne({
      _id: subscriptionId,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.subscriptionDeleted, result));
  }
}

module.exports = new SubscriptionController();

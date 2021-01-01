const Subscription = require("../models/subscription");
const Texts = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
class SubscriptionController {
  async create(req, res) {
    const result = await new Subscription(req.body).save();
    res.status(200).send(response(Texts.texts.subscriptonRequested, result));
  }

  async getAll(req, res) {
    const result = await Subscription.find({}, { password: 0, __v: 0 });
    res
      .status(200)
      .send(response(Texts.texts.allRequestedSubscriptions, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Subscription.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(Texts.errors.subscriptionNotFound);

    res.status(200).send(response(Texts.texts.subscriptonRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Subscription.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(Texts.errors.subscriptionNotFound, 404);

    res
      .status(200)
      .send(response(Texts.texts.qouteRequestQuoteUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Subscription.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(Texts.texts.subscriptionDeleted, result));
  }
}

module.exports = new SubscriptionController();

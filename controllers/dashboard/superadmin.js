const STRINGS = require("../../utils/texts");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const Trades = require("../../models/trades");
const Client = require("../../models/client");
const Site = require("../../models/site");
const SiteIncidents = require("../../models/siteincidents");
const Delivery = require("../../models/delivery");
class DashboardController {
  async create(req, res) {
    const result = await new Trades(req.body).save();

    res.status(200).send(response(STRINGS.TEXTS.tradeCreated, result));
  }

  async getAll(req, res) {
    const totalClients = await Client.countDocuments();
    const sites = await Site.find().populate("means");

    // Deliveries Per Site
    const deliveriesCount = await Delivery.aggregate([
      {
        $group: { _id: "$siteId", count: { $sum: 1 } },
      },
      {
        $lookup: {
          from: STRINGS.MODALS.SITE,
          localField: "siteId",
          foreignField: "_id",
          as: "sites",
        },
      },
    ]);
    console.log(JSON.stringify(deliveriesCount, null, 2));
    // Deliveries Per Client

    return;
    const siteIncidents = await SiteIncidents.find({
      siteId: { $in: sites },
    }).populate("indicents");

    console.log(JSON.stringify(siteIncidents, null, 2));
    //    res.status(200).send(response(STRINGS.TEXTS.allTrades, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Trades.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.tradeNotFount);

    res.status(200).send(response(STRINGS.TEXTS.tradeRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;

    const result = await Trades.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.tradeNotFount, 404);

    res.status(200).send(response(STRINGS.TEXTS.tradeUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Trades.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.tradeDeleted, result));
  }
}
module.exports = new DashboardController();

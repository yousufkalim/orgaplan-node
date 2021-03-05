const STRINGS = require("../../utils/texts");
const Client = require("../../models/client");
const Invoice = require("../../models/invoice");
const response = require("../../utils/response");

class DashboardController {
  async getAll(req, res) {
    let clients = await Client.find();
    let invoices = await Invoice.find();

    const result = {
      clients: {
        delivery: clients.length,
        lockers: 0,
        total: clients.length,
      },
      invoices: {
        total: invoices.length,
      },
    };

    res.status(200).send(response(STRINGS.TEXTS.success, result));
  }
}
module.exports = new DashboardController();

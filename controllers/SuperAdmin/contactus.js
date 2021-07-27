// Init
const STRINGS = require("../../utils/texts");
const response = require("../../utils/response");

// ContactUs Controller
class contactsController {
  async create(req, res) {
    console.log("req for contactus is ", req.body);
    res
      .status(200)
      .send(response(STRINGS.TEXTS.contactCreated, "contact saved"));
  }
}

module.exports = new contactsController();

const ObjectId = require("mongodb").ObjectID;
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Incidents = require("../models/incidents");
const SiteCompanies = require("../models/SiteCompanies");
const Building = require("../models/building");
const DeliveryArea = require("../models/deliveryArea");
const StorageArea = require("../models/storageArea");
const Validations = require("../validators");

class IncidentsController {
  async create(req, res) {
    const validatedData = await Validations.incident.create(req.body);
    if (req.body["image"]) {
      validatedData.photos = req.body["image"];
      delete validatedData.image;
    }
    if (validatedData.location) {
      validatedData.location = JSON.parse(validatedData.location);
    }
    const result = await new Incidents(validatedData).save();
    res.status(200).send(response(STRINGS.TEXTS.incidentCreated, result));
  }

  async getAll(req, res) {
    const result = await Incidents.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allIncidents, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Incidents.findOne(
      { _id: id },
      { password: 0, __v: 0 }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.indcidentNotFound);

    res.status(200).send(response(STRINGS.TEXTS.incidentRequested, result));
  }

  async getIncidentList(req, res) {
    const id = req.params.id;
    const incidents = await Incidents.find({
      siteId: id,
    })
      .populate("location.deliveryArea")
      .populate("location.storageArea")
      .populate("companyId");
    const siteCompanies = await SiteCompanies.findOne({
      siteId: id,
    }).populate("companies.companyId");

    const siteBuildings = await Building.find({
      siteId: id,
    })
      .populate("siteId")
      .populate({
        path: "levels",
        model: STRINGS.MODALS.LEVEL,
        populate: {
          path: "storage",
          model: STRINGS.MODALS.STORAGEAREA,
        },
      });

    const siteDeliveryAreas = await DeliveryArea.find({
      siteId: id,
    });
    const siteStorageAreas = await StorageArea.find({
      siteId: id,
      location: { $ne: STRINGS.STATUS.OUTSIDE },
    });

    const result = {
      incidents,
      site_companies: siteCompanies.companies,
      site_buildings: siteBuildings,
      site_storage_areas: siteStorageAreas,
      site_delivery_areas: siteDeliveryAreas,
      status: [STRINGS.INCIDENTSTATUS.OPEN, STRINGS.INCIDENTSTATUS.CLOSED],
      type: [STRINGS.INCIDENTTYPE.DELAY, STRINGS.INCIDENTTYPE.LETIGATON],
    };
    // const result = await Incidents.findOne(
    //   { _id: id },
    //   { password: 0, __v: 0 }
    // );

    if (!result) throw new CustomError(STRINGS.ERRORS.indcidentNotFound);

    res.status(200).send(response(STRINGS.TEXTS.incidentRequested, result));
  }

  async getIncidentAdmin(req, res) {
    const id = req.params.id;

    const siteCompanies = await SiteCompanies.findOne({
      siteId: id,
    })
      .populate("companies.companyId")
      .populate("companies.subContractors");

    const result = {
      site_companies: siteCompanies.companies,
      locationTypes: [
        STRINGS.MEANLOCATIONTYPE.STORAGEAREA,
        STRINGS.MEANLOCATIONTYPE.DELIVERYAREA,
      ],
    };
    // const result = await Incidents.findOne(
    //   { _id: id },
    //   { password: 0, __v: 0 }
    // );

    if (!result) throw new CustomError(STRINGS.ERRORS.indcidentNotFound);

    res.status(200).send(response(STRINGS.TEXTS.incidentRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const validatedData = await Validations.incident.update(req.body);
    if (req.body["image"]) {
      validatedData.photos = req.body["image"];
      delete validatedData.image;
    }
    const body = validatedData;
    // if (req.files) {
    //   let photos = [];
    //   if (req.files["photos"]) {
    //     req.files["photos"].map((file) => photos.push(file.path));
    //     body.photos = photos;
    //   }
    //   if (req.files["document"]) {
    //     body.document = req.files["document"][0].path;
    //   }
    // }
    if (body.location) body.location = JSON.parse(body.location);
    const result = await Incidents.findByIdAndUpdate(
      { _id: id },
      { $set: validatedData },
      { new: true }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.indcidentNotFound, 404);
    res.status(200).send(response(STRINGS.TEXTS.incidentUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Incidents.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.incidentDeleted, result));
  }

  async filterIncidents(req, res) {
    const body = req.body;
    const siteId = body.siteId;
    const deliveryArea = body.deliveryArea;
    const storageArea = body.storageArea;
    const location = body.location;
    const type = body.type;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const status = body.status;
    const name = body.name;
    const company = body.company;
    const result = await Incidents.find({
      siteId: siteId,
      $and: [
        name ? { name: { $eq: name } } : {},
        type ? { type: { $eq: type } } : {},
        status ? { status: { $eq: status } } : {},
        startDate ? { date: { $gte: new Date(startDate) } } : {},
        endDate ? { date: { $lte: new Date(endDate) } } : {},
        deliveryArea ? { "location.deliveryArea": deliveryArea } : {},
        // location ? { "location._id": location } : {},
        company ? { companyId: { $eq: company } } : {},
        storageArea ? { "location.storageArea": storageArea } : {},
        // { "availability.start": { $lte: new Date() } },
        // { "availability.end": { $gte: new Date() } },
      ],
    })
      .populate({
        path: "location",
        populate: {
          path: "storageArea",
          model: STRINGS.MODALS.STORAGEAREA,
          //     // populate: {
          //     //   path: "level",
          //     //   model: STRINGS.MODALS.LEVEL,
          //     //   match: level ? { _id: { $eq: level } } : {},
          //     // },
        },
      })
      .populate({
        path: "location",
        populate: { path: "deliveryArea", model: STRINGS.MODALS.DELIVERYAREA },
      })
      .populate("companyId");
    if (!result) throw new CustomError(STRINGS.ERRORS.siteIncidentsNotFound);

    res.status(200).send(response(STRINGS.TEXTS.incidentRequested, result));
  }
}
module.exports = new IncidentsController();

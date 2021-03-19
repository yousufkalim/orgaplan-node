const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Mean = require("../models/mean");
const Site = require("../models/site");
const SiteCompanies = require("../models/SiteCompanies");

const Building = require("../models/building");
const DeliveryArea = require("../models/deliveryArea");
const StorageArea = require("../models/storageArea");
const Company = require("../models/company");
const {
  isDateBefore,
  isDateAfter,
  isDateOccuranceChronological,
} = require("../utils/helpers");
const moment = require("moment");
class MeanController {
  async create(req, res) {
    const body = req.body;

    if (req.files) {
      if (req.files["sheet"]) {
        body.sheet = req.files["sheet"][0].path;
      }

      if (req.files["image"]) {
        body.image = req.files["image"][0].path;
      }
    }

    if (!body.availability)
      throw new CustomError(STRINGS.ERRORS.siteCompanyNotFound);

    if (body.availability) {
      body.availability = JSON.parse(body.availability);

      if (!body.availability.start)
        throw new CustomError(STRINGS.ERRORS.startDateIsRequred);
      const site = await Site.findById(body.siteId);
      if (!site) throw new CustomError(STRINGS.ERRORS.siteNotFound);

      isDateOccuranceChronological(
        body.availability.start,
        body.availability.end
      );

      if (isDateBefore(body.availability.start, site.start))
        throw new CustomError(STRINGS.ERRORS.meanStartDateBeforeSiteStartDate);
      if (isDateAfter(body.availability.start, site.end))
        throw new CustomError(STRINGS.ERRORS.meanStartDateBeforeSiteEndtDate);
      if (isDateBefore(body.availability.end, site.start))
        throw new CustomError(STRINGS.ERRORS.meanEndDateBeforeSiteStartDate);

      if (isDateAfter(body.availability.end, site.end))
        throw new CustomError(STRINGS.ERRORS.meanEndDateAfterSiteEndtDate);
    }
    if (body.location) {
      body.location = JSON.parse(body.location);
    }

    if (body.unavailability)
      body.unavailability = JSON.parse(body.unavailability);

    // if (body.picCoordinates)
    //   body.picCoordinates = JSON.parse(body.picCoordinates);
    const result = await new Mean(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.meanCreated, result));
  }

  async getAll(req, res) {
    const result = await Mean.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allMeans, result));
  }

  async getAddMean(req, res) {
    const siteId = req.params.siteId;
    const siteDeliveryAreas = await DeliveryArea.find({
      siteId: siteId,
    });
    const site = await Site.findById(siteId);
    const siteBuildings = await Building.find({
      siteId: siteId,
    }).populate("siteId");

    const siteStorageAreas = await StorageArea.find({
      siteId: siteId,
    });
    const meanTypes = [STRINGS.MEANTYPES.LIFTING, STRINGS.MEANTYPES.ROUTING];
    let result = {
      site_buildings: siteBuildings,
      site_storage_areas: siteStorageAreas,
      site_delivery_areas: siteDeliveryAreas,
      mean_types: meanTypes,
      site: site,
    };
    res.status(200).send(response(STRINGS.TEXTS.allMeans, result));
  }

  async getExternalMeans(req, res) {
    const siteId = req.params.siteId;

    const result = await Mean.find({
      siteId: siteId,
      "location.locationType": STRINGS.MEANLOCATIONTYPE.EXTERIOR,
    }).populate("location.storageArea");
    console.log(result, null, 2);
    res.status(200).send(response(STRINGS.TEXTS.allMeans, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Mean.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async filterMeans(req, res) {
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
    console.log("\n\n\n" + name);

    const result = await Mean.find({
      siteId: siteId,
      $and: [
        name ? { name: { $eq: name } } : {},
        type ? { meanType: { $eq: type } } : {},
        status ? { status: { $eq: status } } : {},
        startDate
          ? { "availability.start": { $gte: new Date(startDate) } }
          : {},
        endDate ? { "availability.end": { $lte: new Date(endDate) } } : {},
        deliveryArea ? { "location.deliveryArea": deliveryArea } : {},
        location ? { "location._id": location } : {},
        storageArea ? { "location.storageArea": storageArea } : {},
        { "availability.start": { $lte: new Date() } },
        { "availability.end": { $gte: new Date() } },
      ],
    })
      .populate({
        path: "location",

        populate: {
          path: "storageArea",

          model: STRINGS.MODALS.STORAGEAREA,

          // populate: {
          //   path: "level",
          //   model: STRINGS.MODALS.LEVEL,
          //   match: level ? { _id: { $eq: level } } : {},
          // },
        },
      })
      .populate({
        path: "location",
        populate: { path: "deliveryArea", model: STRINGS.MODALS.DELIVERYAREA },
      });

    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async getListOfMeans(req, res) {
    const siteId = req.params.siteId;

    const result = await Mean.find({
      siteId: siteId,
      $and: [
        { "availability.start": { $lte: new Date() } },
        { "availability.end": { $gte: new Date() } },
      ],
    })
      .populate({
        path: "location",

        populate: {
          path: "storageArea",

          model: STRINGS.MODALS.STORAGEAREA,

          // populate: {
          //   path: "level",
          //   model: STRINGS.MODALS.LEVEL,
          // },
        },
      })
      .populate({
        path: "location",
        populate: { path: "deliveryArea", model: STRINGS.MODALS.DELIVERYAREA },
      });

    const building = await Building.find({ siteId: siteId });
    if (!building) throw new CustomError(STRINGS.ERRORS.buildingNotFound);

    const siteDeliveryAreas = await DeliveryArea.find({
      siteId: siteId,
    });

    if (!siteDeliveryAreas)
      throw new CustomError(STRINGS.ERRORS.deliveyAreaNotFount);
    const siteStorageAreas = await StorageArea.find({
      siteId: siteId,
    });

    if (!siteStorageAreas)
      throw new CustomError(STRINGS.ERRORS.storageAreaNotFount);

    const siteCompanies = await SiteCompanies.findOne({
      siteId: siteId,
    }).populate("companies.companyId");
    if (!siteCompanies) throw new CustomError(STRINGS.ERRORS.companyNotFound);
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);
    console.log(JSON.stringify(siteCompanies, null, 2));
    res.status(200).send(
      response(STRINGS.TEXTS.meanRequested, {
        means: result,
        site_locations: building,
        site_delivery_areas: siteDeliveryAreas,
        siteStorageAreas: siteStorageAreas,
        // site_locations: siteLocations,
        site_companies: siteCompanies.companies,
        mean_types: [STRINGS.MEANTYPES.LIFTING, STRINGS.MEANTYPES.ROUTING],
        mean_status: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
      })
    );
  }

  async update(req, res) {
    const id = req.params.id;
    const body = req.body;

    if (req.file) {
      body.sheet = req.file.path;
    }
    if (body.location) body.location = JSON.parse(body.location);
    if (!body.availability) body.availability = JSON.parse(body.availability);
    if (body.unavailability)
      body.unavailability = JSON.parse(body.unavailability);

    if (body.picCoordinates)
      body.picCoordinates = JSON.parse(body.picCoordinates);
    const result = await Mean.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound, 404);

    res.status(200).send(response(STRINGS.TEXTS.meanUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Mean.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.meadDeleted, result));
  }
}
module.exports = new MeanController();

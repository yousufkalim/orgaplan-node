const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const Mean = require("../models/mean");
const Site = require("../models/site");
const Building = require("../models/building");
const CustomError = require("../utils/customError");
const StorageArea = require("../models/storageArea");
const DeliveryArea = require("../models/deliveryArea");
const SiteCompanies = require("../models/SiteCompanies");
const Validations = require("../validators");

const { isDateBefore, isDateAfter } = require("../utils/helpers");

class MeanController {
  async create(req, res) {
    const validatedData = Validations.mean.create(req.body);

    const site = await Site.findById(validatedData.siteId);
    if (!site) throw new CustomError(STRINGS.ERRORS.siteNotFound);

    if (isDateBefore(validatedData.availability.start, site.start))
      throw new CustomError(STRINGS.ERRORS.meanStartDateBeforeSiteStartDate);
    if (isDateAfter(validatedData.availability.start, site.end))
      throw new CustomError(STRINGS.ERRORS.meanStartDateBeforeSiteEndtDate);
    if (isDateBefore(validatedData.availability.end, site.start))
      throw new CustomError(STRINGS.ERRORS.meanEndDateBeforeSiteStartDate);
    if (isDateAfter(validatedData.availability.end, site.end))
      throw new CustomError(STRINGS.ERRORS.meanEndDateAfterSiteEndtDate);

    const result = await Mean.create(validatedData);

    await site.update({
      $addToSet: { means: result._id },
    });

    res.status(200).send(response(STRINGS.TEXTS.meanCreated, result));
  }

  async getAll(req, res) {
    const result = await Mean.find();
    res.status(200).send(response(STRINGS.TEXTS.allMeans, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Mean.findById(id, { __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);

    res.status(200).send(response(STRINGS.TEXTS.meanRequested, result));
  }

  async update(req, res) {
    const data = {
      meanId: req.params.id,
      ...req.body,
    };
    const validatedData = Validations.mean.update(data);

    const site = await Site.findById(validatedData.siteId);
    if (!site) throw new CustomError(STRINGS.ERRORS.siteNotFound);

    if (isDateBefore(validatedData.availability.start, site.start))
      throw new CustomError(STRINGS.ERRORS.meanStartDateBeforeSiteStartDate);
    if (isDateAfter(validatedData.availability.start, site.end))
      throw new CustomError(STRINGS.ERRORS.meanStartDateBeforeSiteEndtDate);
    if (isDateBefore(validatedData.availability.end, site.start))
      throw new CustomError(STRINGS.ERRORS.meanEndDateBeforeSiteStartDate);
    if (isDateAfter(validatedData.availability.end, site.end))
      throw new CustomError(STRINGS.ERRORS.meanEndDateAfterSiteEndtDate);

    const result = await Mean.findByIdAndUpdate(
      { _id: validatedData.meanId },
      { $set: validatedData },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.error, 400);

    res.status(200).send(response(STRINGS.TEXTS.meanUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Mean.findByIdAndDelete(id);

    res.status(200).send(response(STRINGS.TEXTS.meadDeleted, result));
  }

  async getAllBySite(req, res) {
    const siteId = req.params.siteId;

    const result = await Mean.find({
      siteId: siteId,
    });

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
      location: { $ne: STRINGS.STATUS.OUTSIDE },
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

    res.status(200).send(response(STRINGS.TEXTS.allMeans, result));
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
      location: { $ne: STRINGS.STATUS.OUTSIDE },
    });

    if (!siteStorageAreas)
      throw new CustomError(STRINGS.ERRORS.storageAreaNotFount);

    const siteCompanies = await SiteCompanies.findOne({
      siteId: siteId,
    }).populate("companies.companyId");
    if (!siteCompanies) throw new CustomError(STRINGS.ERRORS.companyNotFound);
    if (!result) throw new CustomError(STRINGS.ERRORS.meanNotFound);
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
}
module.exports = new MeanController();

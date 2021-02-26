const Site = require("../../models/site");
const STRINGS = require("../../utils/texts");
const Validations = require("../../validators");
const response = require("../../utils/response");
const CustomError = require("../../utils/customError");
const ENV = process.env;

class SuperAdminSitesController {
  async create(req, res) {
    const validatedData = await Validations.site.create(req.body);
    if (!validatedData.zacId) delete validatedData.zacId;

    const site = await Site.create(validatedData);

    await res.status(200).send(response(STRINGS.TEXTS.siteCreated, site));
  }

  async getAll(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Site.find({
      status: { $ne: STRINGS.STATUS.INACTIVE },
    }).countDocuments();
    const items = await Site.find(
      { status: { $ne: STRINGS.STATUS.INACTIVE } },
      { __v: 0, password: 0 }
    )
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("zacId")
      .populate({ path: "adminId", populate: { path: "userId" } });

    if (!items) throw new CustomError(STRINGS.ERRORS.error);

    const result = {
      items,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    };
    res.status(200).send(response(STRINGS.TEXTS.sitesRequested, result));
  }

  async getById(req, res) {
    const id = req.params.id;

    const result = await Site.findById(id, { password: 0, __v: 0 })
      .populate("zacId")
      .populate({ path: "adminId", populate: { path: "userId" } });

    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.siteRequested, result));
  }

  async update(req, res) {
    const validatedData = await Validations.site.update(req.body);

    const result = await Site.findByIdAndUpdate(
      validatedData.siteId,
      {
        $set: validatedData,
      },
      { new: true }
    );
    if (!result) throw new CustomError(STRINGS.ERRORS.siteNotFound);

    res.status(201).send(response(STRINGS.TEXTS.siteUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Site.findByIdAndRemove(id);
    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(201).send(response(STRINGS.TEXTS.siteDeleted, result));
  }

  async getAllArchives(req, res) {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +ENV.ITEMS_PER_PAGE;

    const totalItems = await Site.find({
      status: { $eq: STRINGS.STATUS.INACTIVE },
    }).countDocuments();
    const items = await Site.find(
      { status: { $eq: STRINGS.STATUS.INACTIVE } },
      { __v: 0, password: 0 }
    )
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("zacId")
      .populate({ path: "adminId", populate: { path: "userId" } });

    if (!items) throw new CustomError(STRINGS.ERRORS.error);

    const result = {
      items,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    };
    res.status(200).send(response(STRINGS.TEXTS.sitesRequested, result));
  }

  async archiveSite(req, res) {
    const id = req.params.id;

    const result = await Site.findByIdAndUpdate(id, {
      status: STRINGS.STATUS.INACTIVE,
    })
      .populate("zacId")
      .populate({ path: "adminId", populate: { path: "userId" } });

    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.siteArchived, result));
  }

  async unArchiveSite(req, res) {
    const id = req.params.id;

    const result = await Site.findByIdAndUpdate(id, {
      status: STRINGS.STATUS.ACTIVE,
    })
      .populate("zacId")
      .populate({ path: "adminId", populate: { path: "userId" } });

    if (!result) throw new CustomError(STRINGS.ERRORS.error);

    res.status(200).send(response(STRINGS.TEXTS.siteArchived, result));
  }
}

module.exports = new SuperAdminSitesController();

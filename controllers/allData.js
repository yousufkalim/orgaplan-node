const Site = require("../models/site");
const Mean = require("../models/mean");
const Level = require("../models/level");
const SitePic = require("../models/sitePic");
const Company = require("../models/company");
const LevelPic = require("../models/levelPic");
const Building = require("../models/building");
const Delivery = require("../models/delivery");
const Incident = require("../models/incidents");
const UserSites = require("../models/userSites");
const MeanBooking = require("../models/meanBooking");
const StorageAreas = require("../models/storageArea");
const Organigramme = require("../models/organigramme");
const DeliveryAreas = require("../models/deliveryArea");
const SiteCompanies = require("../models/SiteCompanies");

const buffer = require("buffer");
const moment = require("moment");
const STRINGS = require("../utils/texts");
const ObjectId = require("mongodb").ObjectID;
const Validations = require("../validators");
const response = require("../utils/response");
const { writeLog } = require("../utils/logs");
const CustomError = require("../utils/customError");

class AllDataController {
  async getData(req, res) {
    const userId = req.params.userId;

    ///////////////////// GETTING ALL SITES RELATED TO USER /////////////////////

    const sites = await UserSites.findOne({ userId: userId }).populate(
      "sites.siteId"
    );

    ///////////////////// GETTING DATA RELATED TO A SITE /////////////////////
    let siteData = [];
    Promise.all(
      sites.sites.map(async (site) => {
        const comp = await SiteCompanies.aggregate([
          {
            $match: {
              siteId: ObjectId(site.siteId._id),
            },
          },
          {
            $project: {
              users: {
                $filter: {
                  input: "$users",
                  as: "user",
                  cond: { $eq: ["$$user.userId", ObjectId(userId)] },
                },
              },
            },
          },
          { $unwind: "$users" },
          {
            $project: {
              _id: 0,
              role: "$users.role",
              company: "$users.companyId",
            },
          },
          {
            $lookup: {
              from: Company.collection.name,
              foreignField: "_id",
              localField: "company",
              as: "company",
            },
          },
          { $unwind: "$company" },
        ]);

        const means = await Mean.find({ siteId: site.siteId._id })
          .populate({
            path: "location",
            populate: {
              path: "storageArea",
              model: StorageAreas,
            },
          })
          .populate({
            path: "location",
            populate: { path: "deliveryArea", model: DeliveryAreas },
          })
          .lean();

        const siteMeans = await Mean.find({
          siteId: site.siteId._id,
        }).lean();

        const building = await Building.find({
          siteId: site.siteId._id,
        })
          .populate("levels")
          .lean();

        const storageAreas = await StorageAreas.find({
          siteId: site.siteId._id,
        }).lean();

        const deliveryAreas = await DeliveryAreas.find({
          siteId: site.siteId._id,
        }).lean();

        const levelPic = await LevelPic.find()
          .populate("shapes.mean")
          .populate("shapes.storageArea")
          .lean();

        const deliveries = await Delivery.find({
          siteId: site.siteId._id,
          userId: userId,
        })
          // .populate("companyId")
          .populate("building")
          .populate("deliveryArea")
          .populate("storageArea")
          .populate("liftingMeans")
          .populate("routingMeans")
          .populate("userId")
          .lean();

        const enterpriseDeliveries = await Delivery.find({
          siteId: site.siteId._id,
        })
          // .populate("companyId")
          .populate("building")
          .populate("deliveryArea")
          .populate("storageArea")
          .populate("liftingMeans")
          .populate("routingMeans")
          .populate("userId")
          .lean();

        const meanBooking = await MeanBooking.find({
          siteId: site.siteId._id,
        })
          .populate("companyId")
          .lean();

        const incident = await Incident.find({
          siteId: site.siteId._id,
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
            populate: {
              path: "deliveryArea",
              model: STRINGS.MODALS.DELIVERYAREA,
            },
          })
          .populate("companyId")
          .lean();

        const sitePic = await SitePic.find({ siteId: site.siteId._id })
          .populate("shapes.mean")
          .populate({
            path: "shapes.building",
            populate: { path: "levels" },
          })
          .populate("shapes.storageArea")
          .populate("shapes.deliveryArea")
          .lean();

        const organigramme = await Organigramme.find({
          siteId: site.siteId._id,
        }).lean();

        const siteCompanies = await SiteCompanies.findOne({
          siteId: site.siteId._id,
        })
          .populate("companies.companyId")
          .populate("companies.parentCompanyId")
          .lean();

        const total_inciddents = await Incident.find({
          siteId: site.siteId._id,
        }).countDocuments();

        const site_incidents = {
          total_incidents: total_inciddents,
          site_locations: building,
          site_storage_areas: storageAreas,
          site_delivery_areas: deliveryAreas,
          site_companies: siteCompanies.companies,
          types: Object.values(STRINGS.INCIDENTTYPE),
          statuses: [STRINGS.STATUS.AVAILABLE, STRINGS.STATUS.UNAVAILABLE],
        };

        const site_incident_admin = {
          site_storage_areas: storageAreas,
          site_delivery_areas: deliveryAreas,
          site_companies: siteCompanies.companies,
          locationTypes: [
            STRINGS.MEANLOCATIONTYPE.STORAGEAREA,
            STRINGS.MEANLOCATIONTYPE.DELIVERYAREA,
          ],
        };

        let obj = {
          means: means,
          userSite: site,
          company: comp[0],
          levelPic: levelPic,
          incident: incident,
          buildings: building,
          siteMeans: siteMeans,
          sitePics: sitePic[0],
          deliveries: deliveries,
          meanBooking: meanBooking,
          organigramme: organigramme,
          storageAreas: storageAreas,
          deliveryAreas: deliveryAreas,
          site_incidents: site_incidents,
          siteCompanies: siteCompanies.companies,
          site_incident_admin: site_incident_admin,
          enterpriseDeliveries: enterpriseDeliveries,
        };
        siteData.push(obj);
      })
    )
      .then(() => {
        console.log(
          Buffer.byteLength(JSON.stringify(siteData), "utf8") / 1024,
          "kb"
        );
        res.status(200).send(response("All data", siteData));
      })
      .catch(() => {
        new CustomError(STRINGS.ERRORS.userSitesNotFound);
      });

    // if (!result) throw new CustomError(STRINGS.ERRORS.userSitesNotFound);
  }
}
module.exports = new AllDataController();

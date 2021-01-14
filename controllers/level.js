const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const Level = require("../models/level");
class LevelController {
  async create(req, res) {
    const doesLevelExistInSameBuilding = await Level.findOne({
      name: req.body.name,
      building: req.body.building,
    });
    if (doesLevelExistInSameBuilding)
      throw new CustomError(STRINGS.ERRORS.levelExists, 404);

    const result = await new Level(req.body).save();
    res.status(200).send(response(STRINGS.TEXTS.levelCreated, result));
  }

  async getAll(req, res) {
    const result = await Level.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(STRINGS.TEXTS.allLevels, result));
  }

  async getLevelsByBuilding(req, res) {
    const result = await Level.find(
      { building: req.params.buidingId },
      { password: 0, __v: 0 }
    );
    res.status(200).send(response(STRINGS.TEXTS.allLevels, result));
  }

  async getOne(req, res) {
    const id = req.params.id;

    const result = await Level.findOne({ _id: id }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(STRINGS.ERRORS.levelNotFouned);

    res.status(200).send(response(STRINGS.TEXTS.levelRequested, result));
  }

  async update(req, res) {
    const id = req.params.id;
    const data = req.body;
    if (!data.building)
      throw new CustomError(STRINGS.ERRORS.buildingIdRequired, 404);
    if (!data.name)
      throw new CustomError(STRINGS.ERRORS.levelNameRequired, 404);
    const doesLevelExistInSameBuilding = await Level.findOne({
      name: data.name,
      building: data.building,
    });
    if (doesLevelExistInSameBuilding)
      throw new CustomError(STRINGS.ERRORS.levelExists, 404);

    const result = await Level.findByIdAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(STRINGS.ERRORS.levelNotFouned, 404);

    res.status(200).send(response(STRINGS.TEXTS.levelUpdated, result));
  }

  async delete(req, res) {
    const id = req.params.id;

    const result = await Level.findOne({
      _id: id,
    });
    result.remove();

    res.status(200).send(response(STRINGS.TEXTS.levelDeleted, result));
  }

  async deleteSite(req, res) {
    const id = req.params.id;

    const result = await Level.update(
      { _id: id },
      { $pull: { sites: req.body.siteId } },
      { new: true }
    );

    res.status(200).send(response(STRINGS.TEXTS.siteDeleted, result));
  }
}

module.exports = new LevelController();

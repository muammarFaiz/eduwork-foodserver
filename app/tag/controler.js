const db = require('./model.js');

const createOne = async (req, res, next) => {
  try {
    const result = await db.create(req.query);
    console.log(result);
    res.json(result);
  } catch(e) {
    console.log(e);
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await db.find();
    console.log(result);
    res.json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const editOne = async (req, res, next) => {
  try {
    const filter = {_id: req.params.id};
    const result = await db.findOneAndReplace(filter, req.query, {runValidators: true});
    console.log(result);
    res.json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const result = await db.findByIdAndDelete(req.params.id);
    console.log(result);
    res.json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

module.exports = {
  createOne,
  getAll,
  editOne,
  deleteOne
};
// to router.js

const path = require('path');
const fs = require('fs');
const Product = require('./model.js');
const {addTAgsToPayload, getFileInfo} = require('./productControler-utils')
const categoryModel = require('../category/model')
const tagModel = require('../tag/model')

const insertAll = async (req, res, next) => {
  // const result = await tagModel.create(req.body.data.tosend)
  const tosave = req.body.data.tosend.map(async obj => {
    let toreturn = obj
    const cate = await categoryModel.findOne({name: obj.category})
    if(cate) {
      toreturn.category = cate._id.valueOf()
    } else {
      toreturn.category = 'category not found in db...'
    }

    let tagArrId = obj.tag.map(async str => {
      const tagobj = await tagModel.findOne({name: str})
      if(tagobj) {
        return tagobj._id.valueOf()
      } else {
        return 'tag not found in db...'
      }
    })
    toreturn.tag = await Promise.all(tagArrId)
    return toreturn
  })
  const result = await Promise.all(tosave)
  // console.log(result);
  const saved = await Product.create(result)
  console.log(saved);
  res.send(saved)
  // res.json(result)
  // console.log(tosave);
  // res.json(tosave)
  // console.log(req.body.data);
  // res.send('ok')
}

const store = async (req, res, next) => {
  console.log('controler.js executed');
  try {
    let payload = addTAgsToPayload(req.body);

    if(req.file) {
      // unecessary steps?:
      const fileInfo = getFileInfo(req)

      const src = fs.createReadStream(fileInfo.ori_path);
      const dest = fs.createWriteStream(fileInfo.target_path);
      src.pipe(dest);
      src.on('end', async () => {
        try {
          let product = new Product({...payload, image_url: fileInfo.imageUrl});
          await product.save();
          return res.json(product);
        } catch(err) {
          fs.unlinkSync(fileInfo.target_path);
          if(err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.fields
            });
          }
          next(err);
          }});
      src.on('error', async () => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch(err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

// accept req.body of filter, return pure mongoose result
const testFind = async (req, res, next) => {
  try {
    console.log(req.query);
    const skip = req.query.skip ? req.query.skip : 0
    const limit = req.query.limit ? req.query.limit : 10
    categoryArr = await categoryModel.find({name: {$in: req.query.category}})
    console.log(categoryArr);
    tagArr = await tagModel.find({name: {$in: req.query.tag}})
    console.log(tagArr);

    let filter = {}
    if(categoryArr.length !== 0) {
      console.log('category not zero');
      const categoryIdArr = categoryArr.map(obj => obj._id)
      filter.category = {$in: categoryIdArr}
    } if(tagArr.length !== 0) {
      console.log('tag not zero');
      const tagIdArr = tagArr.map(obj => obj._id)
      filter.tag = {$all: tagIdArr}
    } if(req.query.searchbar) {
      console.log('serachbar not zero');
      filter.productName = RegExp(req.query.searchbar, 'i')
      // console.log(req.query.searchbar);
    }
    console.log(filter);
    const result = await Product.find(filter)
      .populate('category tag', 'name-_id')
      .skip(Number(skip))
      .limit(Number(limit))
    const total = await Product.count(filter)
    res.json({ status: 'success', total: total, result: result });
  } catch(e) {
    console.log(e);
    next(e);
  }
};

const index = async (req, res, next) => {
  const {skip = 0, limit = 10, name = '', category = '', tag = ''} = req.query;
  console.log(req.query);
  const editedQuery = {};
  if(name) editedQuery.name = RegExp(name, 'i');
  if(category) editedQuery.category = category;
  if(tag) editedQuery.tag = tag.split(',');
  try {
    const result = await Product.find(editedQuery)
    .populate('category tag', 'name-_id')
    .skip(Number(skip))
    .limit(Number(limit));
    res.json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

// my own try
const update = async (req, res, next) => {
  try {
    const filterid = {_id: req.params.id};
    const imageUrl = req.file ? `http://localhost:3000/images/${req.file.filename}` : '';
    const payload = req.file ? {...req.body, image_url: imageUrl} : req.body;

    let db_response = await Product.findById(req.params.id);
    const ori_image = path.basename(db_response.image_url);
    fs.unlink(`images/${ori_image}`, (e) => {
      if(e) {
        console.log(e);
        next(e);
      } else {console.log('image deleted...');}
    });
    db_response = await Product.findOneAndReplace(filterid, payload, {runValidators: true});
    res.json(db_response);
  } catch(e) {
    console.log(e);
    next(e);
  }
};

const del = async (req, res, next) => {
  try {
    const filterid = req.params.id;
    const result = await Product.findByIdAndDelete(filterid);
    const image_name = path.basename(result.image_url);
    fs.unlink(`images/${image_name}`, (e) => {
      if(e) {
        console.log(e);
        next(e);
      } else {console.log('image deleted...');}
    });
    console.log(result);
    res.json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const findById = async (req, res, next) => {
  console.log('the product id...');
  console.log(req.body);
  const result = await Product.findById(req.body.productId)
    .select('productName image_url price')
  res.json({destination: req.body.address, quantity: req.body.quantity, data: result})
}

module.exports = {
  store,
  index,
  update,
  del,
  testFind,
  insertAll,
  findById
};
// to router.js

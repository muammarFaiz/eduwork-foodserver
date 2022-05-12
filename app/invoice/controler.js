// invoice is not saved in db
// invoice created after deleting the responsible order in db (the order is done)
// deleting the order already exist in order route
const userModel = require('../user/model')
const productModel = require('../product/model')

const make = async (req, res, next) => {
  let payload
  if(req.query.user && req.body.products) {
    payload = {
      user: req.query.user,
      products: req.body.products.split(',')
    }

    const theuser = await userModel.findOne({id: payload.user}).select('-password -token -userid -__v')

    const products = await productModel.find({_id: {$in: payload.products}}).select('-__v')

    res.json({
      date: Date.now(),
      user: {...theuser._doc},
      products: products
    })

  } else {
    res.send('data is not sufficient')
  }
}

module.exports = {
  make
};

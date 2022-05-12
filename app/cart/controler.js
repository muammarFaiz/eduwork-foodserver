const carts = require('./model')
const products = require('../product/model')

async function findCart(res, filter) {
  try {
    const result = await carts.findOne({
        user: filter
      })
      .populate('user', '-password -token -userid -__v')
      .populate({
        path: 'userCart',
        populate: {
          path: 'product',
          select: '-__v',
          populate: {
            path: 'category tag',
            select: '-__v'
          }
        }
      })
      .select('-__v')

    // console.log(result)
    if(result) {
      return {status: 'ok', data: result}
    } else {
      return {status: 'cart not found', data: result}
    }
  } catch (e) {
    console.log(e)
    return e.message
  }
}

const find = async (req, res, next) => {
  console.log('find is running')
  const filter = req.user.id
  const result = await findCart(res, filter)
  res.send(result)
}

const insertOne = async (req, res, next) => {
  console.log('create is running')
  const payload = {
    user: req.user.id,
    product: req.body.product
  }
  try {
    const checkProduct = await products.findOne({_id: payload.product})
    // if product exists...
    if (checkProduct) {
      const userCart = await carts.findOne({user: payload.user})
      // if user already have a cart...
      if (userCart) {
        const checkDuplicate = userCart.userCart.find(
          obj => obj.product.valueOf() == payload.product
        )
        // if the product already exist in the cart...
        if (checkDuplicate) {
          // add one in quantitty
          console.log('updating the quantity')
          checkDuplicate.quantity = checkDuplicate.quantity + 1
          await userCart.save()
        } else {
          // add new product in cart
          console.log('add new product in cart')
          userCart.userCart.push({product: payload.product, quantity: 1})
          await userCart.save()
        }
        console.log(userCart)
        res.send(userCart)
        // if user does not have a cart...
      } else {
        try {
          // create the cart
          const doc = new carts({
            user: payload.user,
            userCart: [{ product: payload.product, quantity: 1 }]
          })
          await doc.save()
          console.log(doc)
          res.send(doc)
        } catch (e) {
          console.log(e)
          res.send(e.message)
        }
      }
    } else {
      console.log('we dont have that product')
      res.send('product is not available, product id does not found in db')
    }
  } catch (e) {
    console.log(e.message)
    res.send(e.message)
  }
}

// receive the item array id instead of the product id
const deleteMany = async (req, res, next) => {
  console.log('deleteMany is running')
  if (req.body.cartItemIds) {
    const payload = {
      userid: req.user.id,
      cartItemIds: req.body.cartItemIds.split(',')
    }
    // find cart
    const cart = await carts.findOne({user: payload.userid})
    const filtered = cart.userCart.filter(item => {
      return !payload.cartItemIds.includes(item._id.valueOf())
    })
    cart.userCart = filtered
    const result = await cart.save()
    console.log(cart)
    res.send(result)
  } else {
    res.send('the body.cartItemIds is empty')
  }
}

const updateMany = async (req, res, next) => {
  console.log('update many is running')
  const payloadArr = req.body.newArr
  if (!payloadArr) {
    next({message: 'not changing anything? body is empty'})
  } else {
    const payload = {
      userid: req.user.id,
      updatesArray: payloadArr
    }

    const cart = await carts.findOne({user: payload.userid})
    if (cart) {
      cart.userCart = payload.updatesArray
      const result = await cart.save()
      console.log(result)
      res.send(result)

    } else {res.send('cart not found')}
  }
}

module.exports = {
  find,
  insertOne,
  deleteMany,
  updateMany
};

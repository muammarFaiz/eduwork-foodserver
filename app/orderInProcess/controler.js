const orderModel = require('./model')
const cartModel = require('../cart/model')
const {mergeOrderArr} = require('./orderUtils')

// receive an array of object of product id and quantity
const create = async (req, res, next) => {
  if(req.body.order) {
    const payload = {
      userid: req.user.id,
      buying: req.body.order,
      destinationId: req.body.destinationId
    }
    const previousCart = await cartModel.findOne({user: payload.userid})
    const previousOrder = await orderModel.findOne({user: payload.userid})
    if(previousCart) {
      console.log('this user have a cart')
      // reduce the old card
      const oldCart = previousCart.userCart
      const newCart = oldCart.filter(oldItem => {
        const incomingOrder = payload.buying.map(newItem => newItem.product._id)
        return !incomingOrder.includes(oldItem.product.valueOf())
      })
      previousCart.userCart = newCart
      const savedRes = await previousCart.save()
      console.log('updated user cart: ');
      console.log(savedRes)
    } else {
      console.log('this user does not have a cart, continue to saving order to db')
    }

    if(previousOrder) {
      console.log('checking previousOrder if user already have any order in this address...');
      let selectedDestIndex
      const selectedDest = previousOrder.destinationList.filter((obj, i) => {
        if (obj.destination.valueOf() === payload.destinationId) {
          selectedDestIndex = i
          return true
        }
      })
      let prevOrderList
      if(selectedDest.length !== 0) {
        console.log('user already have order in this address, modifying the order list...');
        prevOrderList = selectedDest[0].orderList
        const newArr = mergeOrderArr(payload.buying, prevOrderList)
        console.log(newArr)
        previousOrder.destinationList[selectedDestIndex].orderList = newArr
      } else {
        console.log('user does not have order in this address, updating the destinationList...');
        const tosave = {
          destination: payload.destinationId,
          orderList: payload.buying.map(obj => {return {product: obj.product._id, quantity: obj.quantity}})
        }
        previousOrder.destinationList = [...previousOrder.destinationList, tosave]
      }
      const savingRes = await previousOrder.save()
      console.log('the updated user order document: ');
      console.log(savingRes)
      res.json({status: 'success', data: savingRes})
    } else {
      console.log('create new user order document...');
      const newOrder = new orderModel({
        user: payload.userid,
        destinationList: [{
          destination: payload.destinationId,
          orderList: payload.buying.map(obj => {return {product: obj.product._id, quantity: obj.quantity}})
        }]
      })
      const result = await newOrder.save()
      console.log(result)
      res.json({ status: 'success', data: result })
    }
  } else {
    res.send('req.body.orders is empty')
  }
}

const deleteOrder = async (req, res, next) => {
  const payload = {
    // userid: req.user.id,
    userid: req.query.id,
    orders: req.body.orderids.split(',')
  }
  const userOrder = await orderModel.findOne({user: payload.userid})
  if(userOrder) {
    const newArr = userOrder.orderList.filter(order => !payload.orders.includes(order._id.valueOf()))
    userOrder.orderList = newArr
    console.log(userOrder)
  }
  res.send('ok')
}

const index = async (req, res, next) => {
  console.log('this running....');
  const user = req.user.id
  const result = await orderModel.findOne({user: user})
  .populate('user', 'username email')
  if(result === null) {
    res.send('not found')
  } else {
    console.log(result);
    res.send(result)
  }
}

module.exports = {
  create,
  deleteOrder,
  index
}

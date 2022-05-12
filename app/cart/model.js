const mongoose = require('mongoose')
const {model, Schema} = mongoose

const cartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productCollection',
    required: [true, 'product reference is empty']
  },
  quantity: {
    type: Number,
    required: [true, 'quantity is required']
  }
})

const userCartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'user reference is empty']
  },
  userCart: [cartItemSchema]
})

module.exports = model('cart', userCartSchema)
// rules:
// 1. the product cannot be duplicate
// 2. each user can only have one cart
// 3. the user is allowed to have an empty cart

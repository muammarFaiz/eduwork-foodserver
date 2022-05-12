const {model, Schema} = require('mongoose')

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'productCollection',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const destinationSchema = new Schema({
  destination: {
    type: Schema.Types.ObjectId,
    ref: 'address',
    required: true
  },
  orderList: {
    type: [orderItemSchema],
    required: true
  }
})

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  destinationList: {
    type: [destinationSchema],
    required: true
  }
})

module.exports = model('order', orderSchema);

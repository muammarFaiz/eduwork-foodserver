const mongoose = require('mongoose')
const {model, Schema} = mongoose

const addressSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: [50, 'panjang nama alamat maksimal 300 karakter']
  },
  kelurahan: {
    type: String,
    required: true,
    maxlength: [50, 'panjang nama alamat maksimal 50 karakter']
  },
  kecamatan: {
    type: String,
    required: true,
    maxlength: [50, 'panjang nama alamat maksimal 50 karakter']
  },
  kabupaten: {
    type: String,
    required: true,
    maxlength: [50, 'panjang nama alamat maksimal 50 karakter']
  },
  provinsi: {
    type: String,
    required: true,
    maxlength: [50, 'panjang nama alamat maksimal 50 karakter']
  },
  detail: {
    type: String,
    required: true,
    maxlength: [700, 'panjang nama alamat maksimal 50 karakter']
  }
})

const userAddress = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  addressArr: {
    type: [addressSchema],
    required: true
  }
})

module.exports = model('address', userAddress);

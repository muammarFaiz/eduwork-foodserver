const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'nama kategory terlalu pendek'],
    maxlength: [20, 'nama kategory terlalu panjang']
  }
});

module.exports = model('category', categorySchema);
// to controler.js

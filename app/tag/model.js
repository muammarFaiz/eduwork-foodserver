const {model, Schema} = require('mongoose');

const tagSchema = Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'nama tag terlalu pendek'],
    maxlength: [20, 'nama tag terlalu panjang']
  }
});

module.exports = model('tag', tagSchema);
// to controler.js

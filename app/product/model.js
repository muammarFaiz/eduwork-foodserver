const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const productSchema = Schema({
  productName: {
    type: String,
    minlength: [3, 'nama terlalu pendek'],
    required: [true, 'nama tidak boleh kosong']
  },
  quantity: Number,
  image_url: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  tag: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'tag'
  },
  price: {
    type: String,
    required: true
  },
}, {timeStamps: true});


module.exports = model('productCollection', productSchema);

// kita tambah field dengan type: mongoose.Schema.Types.ObjectId

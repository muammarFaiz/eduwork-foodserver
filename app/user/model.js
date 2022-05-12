const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const {model, Schema} = mongoose;
const bcp = require('bcrypt');

const userSchema = Schema({
  username: {
    type: String,
    minlength: [3, 'username too short'],
    maxlength: [20, 'username too long'],
    required: true
  },
  email: {
    type: String,
    immutable: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  token: [String]
}, {timeStamps: true});

// validasi syntax email di client side

userSchema.statics.myOverwrite = async function(filter, payload) {
  try {
    console.log('myOverwrite running...\n finding the old document...');
    const result = await this.findOne(filter);
    console.log('findOne success');
    if(result) {
      console.log('doc found, overwriting the doc');
      result.overwrite({...result._doc, ...payload});
      const x = await result.save();
      console.log('myOverwrite: doc saved');
      return x;
    } else {
      console.log('doc not found');
      return {_doc: {error: 1, message: 'document not found'}};
    }
  } catch (e) {
    return {_doc: {error: 1, message: 'something wrong statics myOverwrite'}}
  }
};

userSchema.statics.myAddToken = async function(filter, token) {
  try {
    console.log('myAddToken statics running... finding user');
    const user = await this.findOne(filter);
    if(user) {
      console.log('user found, adding token');
      user.token.push(token);
      const x = await user.save();
      console.log('token added, updated user saved, return save result');
      return x;
    } else {
      console.log('user not found, return plain object: user not found');
      return {_doc: {message: 1, addTokenError: 'user not found'}};
    }
  } catch(e) {
    throw new Error(e);
  }
};

userSchema.pre('save', async function(next) {
  console.log('schema pre save running, is password modified??');
  const a = this.isModified('password');
  console.log(a);
  if(a) {
    console.log('password modified, bcrypt is hashing');
    try {
      this.password = await bcp.hash(this.password, 10);
    } catch(e) {
      throw new Error('hash failed');
    }
    console.log('hashing done, next()');
    next();
  } else {
    console.log('password is not modified and bcrypt skipped');
  }
});

userSchema.plugin(AutoIncrement, {inc_field: 'userid'});

module.exports = model('user', userSchema);

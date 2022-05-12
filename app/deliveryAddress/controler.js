const address = require('./model');
const { route } = require('./router');
// const checkAbility = require('../casl-config')
// const {subject} = require('@casl/ability')

// createOne rceive object of newAddress and push it inside the address array
const createOne = async (req, res, next) => {
  const payload = req.body;
  try {
    const findit = await address.findOne({userId: req.user.id})
    if(findit) {
      findit.addressArr = [...findit.addressArr, payload.newAddress]
      const updated = await findit.save()
      console.log(updated);
      res.json({status: 'success', data: updated})
    } else {
      // if no address found create one
      const newAdress = new address({userId: req.user.id, addressArr: [payload.newAddress]})
      await newAdress.save()
      res.json(newAdress);
      // console.log({...payload})
      // res.send('ok')
    }
  } catch(e) {
    res.json({err: 1, message: 'saving to database failed', error: e.message})
  }
}

const index = async (req, res, next) => {
  try {
    const result = await address.find({userId: req.user.id})
    // .populate('userId', '-password -token')
    console.log(result)
    if(result.length) {
      res.json({...result[0]._doc, result: 'success'})
    } else {
      res.json({err: 2, message: 'address.find return empty array'})
    }
  } catch(e) {
    console.log(e)
    res.json({err: 1, message: 'address.find failed', error: e.message})
  }
}

// this edit can be used for one address or many
// but the frontend can only send an array of address with only one updated address
const edit = async (req, res, next) => {
  // the name newAddress is from createone route, maybe change later...
  const payloadArr = req.body.newAddress
  const filter = req.user.id
  try {
    let toedit = await address.findOne({userId: filter})
    if (toedit) {
      toedit.addressArr = payloadArr
      const a = await toedit.save()
      console.log('after save:')
      console.log(a)
      res.json({status: 'success', data: a})
    } else {
      res.send('user address not found')
    }
  } catch(e) {
    console.log(e)
    res.send('hooooooooooooooooooo error')
  }
}

// receive the id of the address to delete
const del = async (req, res, next) => {
  const user = req.user.id
  const toDel = req.body.id
  try {
    const result = await address.findOne({userId: user})
    try {
      const toDel = req.body.id
      const filtered = result.addressArr.filter(obj => obj._id.valueOf() !== toDel)
      result.addressArr = filtered
      const final = await result.save()
      res.json({status: 'success', data: final})
    } catch (error) {
      console.log(error.message);
      res.json({status: 'error in filter or save()?', data: error.message})
    }
  } catch(e) {
    console.log(e)
    res.json({status: 'wow something wrong in findOne?', data: e.message})
  }
}
// create delete...








module.exports = {
  createOne,
  index,
  edit,
  del
}

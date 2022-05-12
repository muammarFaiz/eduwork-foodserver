const router = require('express').Router()

const cartControler = require('./controler')
const checkAbility = require('../casl-config')

router.post('/cart', checkAbility('create', 'Cart'), cartControler.insertOne)
router.get('/cart', checkAbility('read', 'Cart'), cartControler.find)
router.delete('/cart', checkAbility('delete', 'Cart'), cartControler.deleteMany)
router.put('/cart', checkAbility('update', 'Cart'), cartControler.updateMany)

module.exports = router;

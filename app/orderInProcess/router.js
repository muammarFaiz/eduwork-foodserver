const router = require('express').Router()

const orderControler = require('./controler')
const checkAbility = require('../casl-config')

router.get('/order', checkAbility('create', 'Order'), orderControler.index)
router.post('/order', checkAbility('create', 'Order'), orderControler.create)
router.delete('/order', checkAbility('delete', 'Order'), orderControler.deleteOrder)

module.exports = router;

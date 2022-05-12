const router = require('express').Router()

const addressControler = require('./controler')
const checkAbility = require('../casl-config')

router.post('/address', checkAbility('create', 'Address'), addressControler.createOne)
router.get('/address', checkAbility('read', 'Address'), addressControler.index)
router.put('/address', checkAbility('update', 'Address'), addressControler.edit)
router.delete('/address', checkAbility('delete', 'Address'), addressControler.del)

module.exports = router;

// will it include the button when used in html form?
// it will if the button have a name, just remove the name attribute if you don't want to

const router = require('express').Router();
const tagControler = require('./controler.js');
const checkAbility = require('../casl-config')

router.get('/tag', checkAbility('read', 'Tag'), tagControler.getAll);
router.post('/tag', checkAbility('create', 'Tag'), tagControler.createOne);
router.put('/tag/:id', checkAbility('update', 'Tag'), tagControler.editOne);
router.delete('/tag/:id', checkAbility('delete', 'Tag'), tagControler.deleteOne);

module.exports = router;
// to app.js

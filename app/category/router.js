const router = require('express').Router();
const categoryControler = require('./controler.js');
const checkAbility = require('../casl-config')

router.get('/category', checkAbility('read', 'Category'), categoryControler.getAll);
router.post('/category', checkAbility('create', 'Category'), categoryControler.createOne);
router.put('/category/:id', checkAbility('update', 'Category'), categoryControler.editOne);
router.delete('/category/:id', checkAbility('delete', 'Category'), categoryControler.deleteOne);

module.exports = router;
// to app.js

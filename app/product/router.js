const router = require('express').Router();

const productionControler = require('./controler.js');
const checkAbility = require('../casl-config')
const upload = require('./multer-config')

router.post('/products', checkAbility('create', 'Product'), upload.single('image'), productionControler.store);
router.put('/products/:id', checkAbility('update', 'Product'), upload.single('image'), productionControler.update);
router.delete('/products/:id', checkAbility('delete', 'Product'), productionControler.del);
router.get('/products/test', checkAbility('read', 'Product'), productionControler.testFind);
router.post('/products/findbyid', checkAbility('read', 'Product'), productionControler.findById);
// router.get('/products/count', checkAbility('read', 'Product'), productionControler.testFind);

module.exports = router;
// to app.js

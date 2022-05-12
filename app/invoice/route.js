const router = require('express').Router()

const invoiceControler = require('./controler')

router.get('/invoice', invoiceControler.make)

module.exports = router;

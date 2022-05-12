const router = require('express').Router()

const imagesControler = require('./controler')

router.get('/images/:name', imagesControler.sendImage)

module.exports = router
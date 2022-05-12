const router = require('express').Router()
const passport = require('passport')

const userControler = require('./controler.js')
const checkAbility = require('../casl-config')

// no need res.redirect so we can send better information to frontend, redirect better be the frontend job
router.post('/register', userControler.insert1)
router.post('/login', userControler.login)
// logout will ask token only for deleting the token in db
router.get('/logout', userControler.logout)
// update user is separated because it need a token while register and login should be free of token
router.get('/', userControler.verifyUser, userControler.reportLoginStatus)
router.get('/userdata', userControler.verifyUser, userControler.sendUserData)

// router.get('/test', userControler.test1);
module.exports = router;

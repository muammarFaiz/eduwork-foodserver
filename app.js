require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const productRoute = require('./app/product/router.js')
const categoryRoute = require('./app/category/router.js')
const tagRoute = require('./app/tag/router.js')
const userRoute = require('./app/user/router.js')
const {editUser, verifyUser, updateUser} = require('./app/user/controler.js')
const userAddress = require('./app/deliveryAddress/router')
const cartRoute = require('./app/cart/router')
const orderRoute = require('./app/orderInProcess/router')
const invoiceRoute = require('./app/invoice/route')
const {testFind, findById} = require('./app/product/controler')
const imageRoute = require('./app/imageApi/router')
const {getAll: getAllCategory} = require('./app/category/controler')
const {getAll: getAllTags} = require('./app/tag/controler')
// not used
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// passport
require('./app/user/passportLocalStrategy');
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// not used
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/auth', userRoute);
app.post('/auth2/verify2', verifyUser, editUser);
app.post('/auth2/updateuser', verifyUser, updateUser);
app.use('/api', verifyUser, productRoute, categoryRoute, tagRoute, userAddress, cartRoute, orderRoute, invoiceRoute);
// app.use('/test', )
app.use('/index', testFind)
app.use('/tags', getAllTags)
app.use('/categories', getAllCategory)
app.use(imageRoute)

app.route('/images/:imageName').get((req, res) => {
  res.sendFile(__dirname + '/images/' + req.params.imageName);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('wrong path??');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

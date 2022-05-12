const mongoose = require('mongoose');
const dv = require('../app/config.js');

// const password = dv.PASSWORD;
// const connAtlas = 'mongodb://faiz1:' + password + '@cluster0-shard-00-00.bd5hs.mongodb.net:27017,cluster0-shard-00-01.' +
// 'bd5hs.mongodb.net:27017,cluster0-shard-00-02.bd5hs.mongodb.net:27017/cluster0?ssl=true&' +
// 'replicaSet=atlas-10erh7-shard-0&authSource=admin&retryWrites=true&w=majority';

const pass = '123'
const onlineDB = 'eduwork-1'
const connAtlas2 = `mongodb://faiz1:${pass}@cluster0-shard-00-00.bd5hs.mongodb.net:` +
  '27017,cluster0-shard-00-01.bd5hs.mongodb.net:27017,cluster0-shard-00-02.bd5hs.mongodb.net:27017' +
  `/${onlineDB}?ssl=true&replicaSet=atlas-10erh7-shard-0&authSource=admin&retryWrites=true&w=majority`

const local = 'mongodb://localhost:27017/eduwork-1';
// console.log(connAtlas);

mongoose.connect(connAtlas2);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error test atlas: '));
db.once('open', () => {console.log('connection mongoose success...');});

module.exports = db;
// to bin/www.js

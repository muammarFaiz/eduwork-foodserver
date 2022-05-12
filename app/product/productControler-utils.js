const path = require('path');
const config = require('../config.js');

const addTAgsToPayload = (payload) => {
  if(payload.tag) {
    const tagArray = payload.tag.split(',');
    console.log(tagArray);
    return {...payload, tagArray};
  } else {
    console.log('tag is empty...');
    return payload
  }
}

const getFileInfo = (req) => {
  let ori_path = req.file.path;
  let oriExtension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
  let filename = req.file.filename + '.' + oriExtension;
  let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);
  let imageUrl = `http://localhost:3000/images/${req.file.filename}`;

  return {ori_path, oriExtension, filename, target_path, imageUrl}
}







module.exports = {
  addTAgsToPayload,
  getFileInfo
}

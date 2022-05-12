const multer = require('multer');

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-studikasus-" + file.originalname);
  }
});
const upload = multer({storage: storageEngine});

module.exports = upload

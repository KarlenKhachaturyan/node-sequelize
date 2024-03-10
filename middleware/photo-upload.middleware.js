const multer = require('multer');
const storage = multer.memoryStorage();

module.exports = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

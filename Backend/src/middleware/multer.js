const multer = require('multer');

const storage = multer.memoryStorage(); // No local file storage
const upload = multer({ storage });

module.exports = upload;
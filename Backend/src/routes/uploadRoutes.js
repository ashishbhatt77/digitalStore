const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const uploadImage = require('../utils/uploadImage');

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = await uploadImage(req.file.buffer);
  if (!imageUrl) return res.status(500).json({ error: "Upload failed" });

  res.json({ imageUrl });
});

module.exports = router;
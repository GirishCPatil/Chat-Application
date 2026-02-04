const express = require("express");
const multer = require("multer");
const { uploadToS3 } = require("../controllers/mediaController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileUrl = await uploadToS3(req.file);
    res.json({ fileUrl });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;

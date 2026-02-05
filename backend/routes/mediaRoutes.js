const express = require("express");
const multer = require("multer");
const { uploadToS3 } = require("../controllers/mediaController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("FILE:", req.file);   // 👈 ADD THIS

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const fileUrl = await uploadToS3(req.file);
    res.json({ fileUrl });
  } catch (err) {
    console.error("UPLOAD ERROR:", err); // 👈 ADD THIS
    res.status(500).json({ error: "Upload failed" });
  }
});


module.exports = router;

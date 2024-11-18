const express = require("express");
const { analyzeImage, upload } = require("../controllers/imageController");

const router = express.Router();

router.post("/analyze-image", analyzeImage);

module.exports = router;

const { analyzeImageFromURL, upload } = require("../models/imageReader");

async function analyzeImage(req, res) {
	try {
		const { imageUrl } = req.body;

		if (!imageUrl) {
			return res.status(400).json({ success: false, error: "Image URL is required." });
		}

		const analysisResult = await analyzeImageFromURL(imageUrl);

		res.json({ success: true, analysis: analysisResult });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
}

module.exports = {
	analyzeImage,
	upload,
};

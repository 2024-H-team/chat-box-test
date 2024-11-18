const { OpenAI } = require("openai");
const multer = require("multer");

const openai = new OpenAI({
	apiKey: process.env.IMG_API_KEY,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function analyzeImageFromURL(imageUrl) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"あなたは画像分析AIです。指定された画像を分析し、画像内の主要な物体を一つだけ正確に特定して説明してください。他の情報は省略してください。",
				},
				{
					role: "user",
					content: [
						{
							type: "text",
							text: "この画像に含まれている主要な物体を一つだけ説明してください,物体の名前だけでいいです。",
						},
						{
							type: "image_url",
							image_url: {
								url: imageUrl,
							},
						},
					],
				},
			],
			max_tokens: 300,
		});

		return response.choices[0]?.message?.content;
	} catch (error) {
		console.error("Error analyzing image:", error);
		throw new Error("An error occurred while analyzing the image.");
	}
}

module.exports = {
	analyzeImageFromURL,
	upload,
};

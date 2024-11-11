require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || "localhost";

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, host, () => {
	console.log(`Server is running at http://${host}:${port}`);
});

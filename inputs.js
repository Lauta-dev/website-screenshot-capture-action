const { getInput } = require("@actions/core");

const url = getInput("url");
const name = getInput("name");
const pagesFile = getInput("pages_file");
const outputDir = getInput("output");

// Optional Inputs
const width = Number.parseInt(getInput("width")); // Default: 1360
const height = Number.parseInt(getInput("height")); // Default: 768
const fileType = getInput("type"); // Default: png
const quality = Number.parseInt(getInput("quality")); // Default 100

module.exports = {
	url,
	name,
	pagesFile,
	width,
	height,
	type: fileType,
	quality,
	outputDir,
};

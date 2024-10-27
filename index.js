const core = require("@actions/core");
const { captureScreenshot } = require("./generateScreenshot.js");
const { yamlToObject } = require("./yamlToObject.js");
const { dir } = require("./const.js");
const { pagesFile, url, name } = require("./inputs.js");

async function main() {
	try {
		let output;

		if (pagesFile) {
			const arr = await yamlToObject(pagesFile);

			output = await captureScreenshot({ pages: arr.pages });
		} else if (url && name) {
			output = await captureScreenshot({
				onlyPageUrl: url,
				onlyPageName: name,
			});
		}

		if (!output.ok) {
			throw new Error(output.message);
		}

		core.setOutput("screenshot-path", dir);
	} catch (error) {
		core.setFailed(error.message);
	}
}

main();

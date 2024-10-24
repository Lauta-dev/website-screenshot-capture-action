const core = require("@actions/core");
const { captureScreenshot } = require("./generateScreenshot.js");
const { yamlToObject } = require("./yamlToObject.js");

async function main() {
	const dir = "./screenshots";

	try {
		const url = core.getInput("url");
		const name = core.getInput("name");
		let pagesFile = core.getInput("pages_file");

		if (pagesFile) {
			pagesFile = await yamlToObject(pagesFile);

			await captureScreenshot({ pages: pagesFile.pages });
		} else if (url && name) {
			await captureScreenshot({
				onlyPageUrl: url,
				onlyPageName: name,
			});
		}

		core.setOutput("screenshot-path", dir);
	} catch (error) {
		core.setFailed(error.message);
	}
}

main();

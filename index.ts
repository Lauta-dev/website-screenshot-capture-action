import * as core from "@actions/core";
import { captureScreenshot } from "./generateScreenshot";
import { yamlToObject } from "./yamlToObject";
import { pagesFile, url, name, outputDir } from "./inputs";

console.log("::debug::main");

async function main() {
	try {
		let output;

		if (pagesFile) {
			const arr = await yamlToObject(pagesFile);

			if (!arr) {
				output = await captureScreenshot({ pages: arr });
			}
		} else if (url && name) {
			output = await captureScreenshot({
				onlyPageUrl: url,
				onlyPageName: name,
			});
		}

		if (!output) {
			return;
		}

		if (!output.ok) {
			throw new Error(output.message as string);
		}

		core.setOutput("screenshot-path", outputDir);
	} catch (error) {
		core.setFailed(error as string);
	}
}

main();

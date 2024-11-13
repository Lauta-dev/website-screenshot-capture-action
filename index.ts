import * as core from "@actions/core";
import { captureScreenshot } from "./src/generateScreenshot";
import { yamlToObject } from "./src/yamlToObject";
import { pagesFile, url, name, outputDir } from "./src/inputs";

async function main() {
	try {
		let output;

		if (pagesFile) {
			const arr = await yamlToObject(pagesFile);

			if (!arr.ok) {
				throw new Error(arr.errMessage as string);
			}

			output = await captureScreenshot({ pages: arr.pages });
		} else if (url && name) {
			output = await captureScreenshot({
				onlyPageUrl: url,
				onlyPageName: name,
			});
		} else {
			throw new Error(
				"Se debe proporcionar un archivo YAML o los parámetros 'url' y 'name'.",
			);
		}

		if (!output) {
			throw new Error("No se generó ninguna captura de pantalla.");
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

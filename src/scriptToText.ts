import fs from "node:fs";
import * as core from "@actions/core";

export function scriptToText(script?: string) {
	if (!script) {
		core.info(`No se especificó el script, se ignorará`);
		return "";
	}

	if (!script.endsWith(".js")) {
		core.info(`El script no es un archivo JS, se ignorará`);
		return "";
	}

	const scriptContent = fs.readFileSync(script, "utf8");
	core.debug(`Script content: ${scriptContent}`);

	return scriptContent;
}

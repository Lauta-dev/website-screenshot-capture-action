import fs from "node:fs";

export function scriptToText(script?: string) {
	console.log(`::debug::scriptToText: ${script}`);

	if (!script) {
		console.log(`::warning::No se especificó el script, se ignorará`);
		return "";
	}

	if (!script.endsWith(".js")) {
		console.log(`::warning::El script no es un archivo JS, se ignorará`);
		return "";
	}

	const scriptContent = fs.readFileSync(script, "utf8");
	console.log(`::debug::Script content: ${scriptContent}`);

	return scriptContent;
}

import { script } from "./inputs";

export function scriptToText() {
	const scriptFile = script;

	if (!scriptFile) {
		return;
	}

	const scriptContent = fs.readFileSync(scriptFile, "utf8");
	console.log(`::debug::Script content: ${scriptContent}`);

	return scriptContent;
}

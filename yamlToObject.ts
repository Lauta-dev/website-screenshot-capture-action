import { parse } from "yaml";
import { readFileSync } from "node:fs";

export async function yamlToObject(file: string) {
	try {
		const yaml = readFileSync(file, "utf8");
		return parse(yaml);
	} catch (error) {
		throw new Error(error as string);
	}
}

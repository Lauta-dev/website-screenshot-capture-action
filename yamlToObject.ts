import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { PageFile } from "./interface/pageFile";

export async function yamlToObject(file: string): Promise<PageFile[] | Error> {
	try {
		const yaml = readFileSync(file, "utf8");
		console.log(JSON.stringify(yaml));
		const parseYaml = parse(yaml);

		console.log(parseYaml.pages);
		return parseYaml.pages;
	} catch (error) {
		throw new Error(error as string);
	}
}

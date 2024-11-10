import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { PageFile } from "./interface/pageFile";

export async function yamlToObject(file: string): Promise<PageFile[] | Error> {
	console.log(file);

	try {
		const yaml = readFileSync(file, "utf8");
		return parse(yaml).pages;
	} catch (error) {
		throw new Error(error as string);
	}
}

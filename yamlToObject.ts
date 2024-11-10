import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { PageFile } from "./interface/pageFile";

export async function yamlToObject(file: string): Promise<PageFile[] | Error> {
	try {
		const yaml = readFileSync(file, "utf8");
		console.log(JSON.stringify(yaml));
		return parse(yaml).pages;
	} catch (error) {
		throw new Error(error as string);
	}
}

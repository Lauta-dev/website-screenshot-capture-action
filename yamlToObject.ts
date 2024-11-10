import { parse } from "yaml";
import { readFileSync, existsSync } from "node:fs";
import { PageFile } from "./interface/pageFile";

export async function yamlToObject(
	file: string,
): Promise<{ pages?: PageFile[]; ok: boolean; errMessage?: string }> {
	try {
		if (!existsSync(file)) {
			throw new Error(`El archivo ${file} no existe`);
		}

		const yaml = readFileSync(file, "utf8");
		const parseYaml: { pages: PageFile[] } = parse(yaml);

		if (!parseYaml.pages) {
			throw new Error(`No se encontraron páginas en el archivo ${file}`);
		}

		return { pages: parseYaml.pages, ok: true };
	} catch (error) {
		return { ok: false, errMessage: error as string };
	}
}

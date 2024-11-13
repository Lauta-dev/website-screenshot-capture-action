import { parse } from "yaml";
import { readFileSync, existsSync } from "node:fs";
import { PageFile } from "./interface/pageFile";

function validate(parseYaml: { pages: PageFile[] }, file: string) {
	try {
		if (!Array.isArray(parseYaml.pages)) {
			throw new Error(`No se encontraron páginas en el archivo ${file}`);
		}
		parseYaml.pages.forEach((page) => {
			if (typeof page.url !== "string" || !page.url) {
				throw new Error("Cada página debe tener una URL válida.");
			}
			if (typeof page.name !== "string" || !page.name) {
				throw new Error("Cada página debe tener un nombre válido.");
			}
			if (page.script && typeof page.script !== "string") {
				throw new Error(
					"Si se proporciona 'script', debe ser una cadena de texto.",
				);
			}
		});

		return {
			ok: true,
		};
	} catch (error) {
		return { ok: false, errMessage: error as string };
	}
}

export async function yamlToObject(
	file: string,
): Promise<{ pages?: PageFile[]; ok: boolean; errMessage?: string }> {
	try {
		if (!existsSync(file)) {
			throw new Error(`El archivo ${file} no existe`);
		}

		const yaml = readFileSync(file, "utf8");
		const parseYaml: { pages: PageFile[] } = parse(yaml);

		const val = validate(parseYaml, file);

		if (!val.ok) {
			throw new Error(val.errMessage as string);
		}

		return { pages: parseYaml.pages, ok: true };
	} catch (error) {
		return { ok: false, errMessage: error as string };
	}
}

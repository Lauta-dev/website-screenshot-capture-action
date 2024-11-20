import puppeteer, { Page, ScreenshotOptions } from "puppeteer";
import fs from "node:fs";
import {
	width,
	height,
	type,
	quality,
	outputDir,
	script,
	darkMode,
} from "./inputs";
import { Warning } from "./Warning";
import { scriptToText } from "./scriptToText";
import { PageFile } from "./interface/pageFile";
import * as core from "@actions/core";
import { allTypes, acceptedQualityFormat, acceptedFormats } from "./const";

async function savePageScreenshot({
	url,
	name,
	script,
	page,
}: {
	url?: string;
	name?: string;
	script: string;
	page: Page;
}) {
	try {
		if (!url) {
			throw new Warning("No se dio la URL");
		}

		const res = await page.goto(url);
		const emulateMediaFeatures = [
			{
				name: "prefers-color-scheme",
				value: darkMode,
			},
		];

		if (!res) {
			return;
		}

		if (!res.ok()) {
			core.warning(
				`La URL: ${url} no se procesara, código de estado: ${res.status()}`,
			);
		}
		let path = `${name}.${type}`;

		// Run script before screenshot
		// Evaluate script run in blowser context
		await page.evaluate(script);

		const screenshotOptions: ScreenshotOptions = { path, type };

		if (acceptedQualityFormat.includes(type)) {
			screenshotOptions.quality = quality;
		}

		if (!allTypes.includes(type)) {
			throw new Error(
				`Formato de imagen no soportado: ${type}, se admite: ${acceptedFormats}`,
			);
		}

		await page.emulateMediaFeatures(emulateMediaFeatures);
		await page.screenshot(screenshotOptions);

		fs.renameSync(path, `${outputDir}/${path}`);
		core.info(`Info: URL ${url} procesada. Ruta: ${outputDir}/${path}`);
	} catch (error) {
		throw new Error(`${error}`);
	}
}

export async function captureScreenshot({
	pages,
	onlyPageName,
	onlyPageUrl,
}: {
	pages?: PageFile[];
	onlyPageName?: string;
	onlyPageUrl?: string;
}) {
	let browser;

	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: [`--no-sandbox`, `--disable-setuid-sandbox`],
			executablePath: "/usr/bin/chromium",
		});

		const page = await browser.newPage();
		await page.setViewport({ width, height });

		// Hace un loop al archivo de páginas
		if (pages) {
			for (const { name, url, script } of pages) {
				try {
					await savePageScreenshot({
						url,
						name,
						page,
						script: scriptToText(script),
					});
				} catch (error) {
					core.warning(`Error procesando la página ${name}: ${error}`);
				}
			}
		} else if (onlyPageName && onlyPageUrl) {
			// Carga la url, name y script de la página por los inputs
			try {
				await savePageScreenshot({
					url: onlyPageUrl,
					name: onlyPageName,
					page,
					script: scriptToText(script),
				});
			} catch (error) {
				return { ok: false, message: error };
			}
		} else {
			throw new Error(
				"Se debe espicificar el 'name' y 'url' de la página o el archivo de páginas 'urls_input_file'",
			);
		}

		return {
			ok: true,
			message: `Imagenes generadas en ${outputDir}`,
		};
	} catch (error) {
		return { ok: false, message: error };
	} finally {
		if (browser) await browser.close();
	}
}

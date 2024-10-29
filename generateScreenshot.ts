import puppeteer, { Page } from "puppeteer";
import fs from "node:fs";
import { width, height, type, quality, outputDir } from "./inputs";
import { Warning } from "./Warning";

async function savePageScreenshot({
	url,
	name,
	page,
}: {
	url?: string;
	name?: string;
	page: Page;
}) {
	try {
		if (!url) {
			throw new Warning("No se dio la URL");
		}

		const res = await page.goto(url);

		if (!res) {
			return;
		}

		if (!res.ok()) {
			throw new Warning(
				`La URL: ${url} no se procesara, código de estado: ${res.status()}`,
			);
		}
		let path = `${name}.${type}`;
		const headers = res.headers();
		const contentType = headers["content-type"];

		const prettyJson = async () => {
			await page.evaluate(() => {
				const body = document.body;
				const rawText = body.innerText;
				const parseText = JSON.parse(rawText);
				const pr = JSON.stringify(parseText, null, 2);

				body.innerHTML = `<pre>:::::::: ${pr}</pre>`;
			});
		};

		console.log(contentType);

		if (type == "png") {
			if (contentType.includes("application/json")) {
				await prettyJson();
				await page.screenshot({ path, type });
			} else {
				await page.screenshot({ path, type });
			}
		} else {
			if (contentType.includes("application/json")) {
				await prettyJson();

				await page.screenshot({ path, type, quality });
			} else {
				await page.screenshot({ path, type, quality });
			}
		}

		fs.renameSync(path, `${outputDir}/${path}`);
		console.log(`Info: URL: ${url} procesada. Ruta: ${outputDir}/${path}`);
	} catch (error) {
		throw new Error(`Error: ${error}`);
	}
}

export async function captureScreenshot({
	pages,
	onlyPageName,
	onlyPageUrl,
}: {
	pages?: { name: string; url: string }[];
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

		if (pages) {
			for (const { name, url } of pages) {
				try {
					await savePageScreenshot({ url, name, page });
				} catch (error) {
					console.log(`::warning::${error}`);
				}
			}
		} else {
			try {
				await savePageScreenshot({
					url: onlyPageUrl,
					name: onlyPageName,
					page,
				});
			} catch (error) {
				return { ok: false, message: error };
			}
		}

		return {
			ok: true,
			message: `Imagenes generadas en ${outputDir}`,
		};
	} catch (error) {
		return { ok: false, message: error };
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

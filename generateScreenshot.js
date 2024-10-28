const puppeteer = require("puppeteer");
const fs = require("node:fs");
const { width, height, type, quality, outputDir } = require("./inputs.js");
const { Warning } = require("./Warning.js");

/**
 *
 * @param {Object} param0
 * @param {string} param0.url
 * @param {string} param0.name
 * @param {puppeteer.Page} param0.page
 */
async function savePageScreenshot({ url, name, page }) {
	try {
		const res = await page.goto(url);

		if (!res.ok()) {
			throw new Warning(
				`La URL: ${url} no se procesara, código de estado: ${res.status()}`,
			);
		}
		let path = `${name}.${type}`;

		if (type == "png") {
			await page.screenshot({ path, type });
		} else {
			await page.screenshot({ path, type, quality });
		}

		fs.renameSync(path, `${outputDir}/${path}`);
		console.log(`Info: URL: ${url} procesada. Ruta: ${outputDir}/${path}`);
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
}

/**
 * @param {Object} param0
 * @param {Array<{ name: string, url: string }>} param0.pages
 * @param {string} param0.onlyPageName
 * @param {string} param0.onlyPageUrl
 */
async function captureScreenshot({ pages, onlyPageName, onlyPageUrl }) {
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
					console.log(`::warning::${error.message}`);
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
				return { ok: false, message: error.message };
			}
		}

		return {
			ok: true,
			message: `Imagenes generadas en ${outputDir}`,
		};
	} catch (error) {
		return { ok: false, message: error.message };
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

module.exports = {
	captureScreenshot,
};

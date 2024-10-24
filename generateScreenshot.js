const puppeteer = require("puppeteer");
const fs = require("node:fs");
const core = require("@actions/core");

const dir = "screenshots";

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
		const quality = core.getInput("quality");
		const type = core.getInput("type");

		if (!res.ok()) {
			throw new Error(`Error al acceder a la página. Estado: ${res.status()}`);
		}

		let path = `${name}.${type}`;
		await page.screenshot({ path, type, quality });
		fs.renameSync(path, `${dir}/${path}`);
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

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: [`--no-sandbox`, `--disable-setuid-sandbox`],
			executablePath: "/usr/bin/chromium",
		});

		const page = await browser.newPage();

		await page.setViewport({
			width: core.getInput("width"),
			height: core.getInput("height"),
		});

		if (pages) {
			for (const { name, url } of pages) {
				try {
					await savePageScreenshot({ url, name, page });
				} catch (error) {
					throw new Error(error.message);
				} finally {
					return { ok: false, message: error.message };
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
			} finally {
				await browser.close();
			}
		}

		return {
			ok: true,
			message: `Imagenes generadas en ${dir}`,
		};
	} catch (error) {
		return { ok: false, message: error.message };
	}
}

module.exports = {
	captureScreenshot,
};

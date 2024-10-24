const y = require("yaml");
const fs = require("node:fs");

/**
 * @param {string} file
 * */
async function yamlToObject(file) {
	try {
		const yaml = await fs.readFileSync(file, "utf8");
		return y.parse(yaml);
	} catch (error) {
		throw new Error(error.message);
	}
}

module.exports = {
	yamlToObject,
};

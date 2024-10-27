class Warning extends Error {
	constructor(message) {
		super(message);
		this.name = "URLError";
	}
}

module.exports = {
	Warning,
};

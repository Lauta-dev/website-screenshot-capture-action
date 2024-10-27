class Warning extends Error {
	constructor(message) {
		super(message);
		this.name = "Warning";
	}
}

module.exports = {
	Warning,
};

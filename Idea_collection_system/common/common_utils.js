const fs = require("fs");
const os = require("os");
const path = require("path");

const envFilePath = path.resolve(__dirname, "../.env");

const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

const setEnvValue = (key, value) => {
	const envVars = readEnvVars();
	const targetLine = envVars.find((line) => line.split("=")[0] === key);
	if (targetLine !== undefined) {
		// update existing line
		const targetLineIndex = envVars.indexOf(targetLine);
		// replace the key/value with the new value
		envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
	} else {
		// create new key value
		envVars.push(`${key}="${value}"`);
	}
	// write everything back to the file system
	fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

function getCurrentDate() {
	const today = new Date();
	const day = String(today.getDate()).padStart(2, "0");
	const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	const year = today.getFullYear();

	return `${year}-${month}-${day}`;
}

function hasClosurePassed(currentDate, closureDate) {

	// Create Date objects from the parts
	const dateObj1 = new Date(currentDate);
	const dateObj2 = new Date(closureDate);

	if (dateObj1 >= dateObj2) {
		return true;
	} else {
		return false;
	}
}

module.exports = {
	hasClosurePassed,
	getCurrentDate,
	setEnvValue,
};

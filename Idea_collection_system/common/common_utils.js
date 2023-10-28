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

	return `${day}/${month}/${year}`;
}

function hasClosurePassed(currentDate, closureDate) {
	const parts1 = currentDate.split("/"); // Split the first date string into day, month, and year
	const parts2 = closureDate.split("/"); // Split the second date string into day, month, and year

	// Create Date objects from the parts
	const dateObj1 = new Date(`${parts1[2]}-${parts1[1]}-${parts1[0]}`);
	const dateObj2 = new Date(`${parts2[2]}-${parts2[1]}-${parts2[0]}`);

	if (dateObj1 >= dateObj2) {
		return true;
	} else {
		return false;
	}
}


module.exports = {
    hasClosurePassed,
    getCurrentDate,
    setEnvValue
}
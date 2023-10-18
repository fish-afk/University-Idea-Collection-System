const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname;
		const fileExtension = path.extname(fileName);
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + fileExtension);
	},
});

const upload = multer({ storage: storage });

module.exports = { upload };

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateJwtToken = (username, privs = "staff") => {
	const date = new Date();
	const JWT_EXPIRATION_TIME =
		privs === "Admin"
			? Math.floor(date.getTime() / 1000) + 60 * 20 // 20 minutes from now if admin
			: Math.floor(date.getTime() / 1000) + 60 * 30; // 30 minutes from now if staff/qa-manager/qa-coordinator

	const freshJwt = jwt.sign(
		{ username, exp: JWT_EXPIRATION_TIME, privs: privs },
		JWT_SECRET,
	);

	return freshJwt;
};

function verifyJWT(req, res, next) {
	// Get the user's username from the decoded token
	const username = req.body["username"];
	const token = req.body["jwt_key"];

	if (!token || !username) {
		return res
			.status(401)
			.send({ status: false, message: "Missing auth fields !" });
	}
	// Verify the JWT and check that it is valid
	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).send({ status: false, message: err.message });
		}
		if (decoded.exp < Date.now() / 1000) {
			return res
				.status(401)
				.send({ status: false, message: "JWT has expired" });
		}
		// If the JWT is valid, save the decoded user information in the request object
		// so that it is available for the next middleware function
		if (decoded.username != username) {
			return res.status(401).send({ status: false, message: "Token mismatch" }); // Token is not this users, but another users
		}

		req.decoded = decoded;
		next();
	});
}



module.exports = {
	generateJwtToken,
	verifyJWT,
};


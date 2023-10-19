const jwt = require("jsonwebtoken");
const Mysql = require('../models/_mysql');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateJwtToken = (username, privs = "staff", type = "normal") => {
	const date = new Date();
	const JWT_EXPIRATION_TIME =
		privs === "admin" // privs can either be staff, qa_manager, qa_coordinator or admin
			? Math.floor(date.getTime() / 1000) + 60 * 20 // 20 minutes from now if admin
			: Math.floor(date.getTime() / 1000) + 60 * 30; // 30 minutes from now if staff/qa_manager/qa_coordinator

	const REFRESH_EXPIRATION_TIME = date.setMonth(date.getMonth() + 1); // 1 month from now

	const freshJwt = jwt.sign(
		{ username, exp: type == "normal" ? JWT_EXPIRATION_TIME: REFRESH_EXPIRATION_TIME, privs: privs },
		type == "normal" ? JWT_SECRET : REFRESH_SECRET,
	);

	return freshJwt;
};


const generateRefreshToken = (username, privs = "staff") => {
	return new Promise((resolve, reject) => {
		const query = `UPDATE users SET auth_refresh_token = ? WHERE username = ?`;

		let token = generateJwtToken(username, privs, "refresh");

		Mysql.connection.query(query, [token, username], (err, results) => {
			if (err) {
				reject(false); // Reject the promise with the error
			} else {
				resolve(token); // Resolve the promise with the token
			}
		});
	});
};


async function verifyRefreshToken(refreshToken, username, res) {
	
	const query = `SELECT * FROM users WHERE auth_refresh_token = ? and username = ?`;

	Mysql.connection.query(query, [refreshToken, username], (err, result) => {
		if (err || !result) {
			return res.send({status: "FAILURE", message: "Token not found, login in again"})
		} else {
			jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
				if (err) {
					return res.status(404).send({ auth: false, message: err.message });
				}
				if (decoded.exp < Date.now() / 1000) {
					return res.status(401).send("Refresh token has expired");
				}
				// If the JWT is valid, save the decoded user information in the request object
				// so that it is available for the next middleware function
				if (decoded.username != username) {
					return res
						.status(404)
						.send({ auth: false, message: "Token mismatch" }); // Token is not this users, but another users
				}

				return res.send({
					status: true,
					jwt: generateJwtToken(username, decoded.privs, "normal")
				});
			});
		}
	})
}

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
	generateRefreshToken,
	verifyJWT,
	verifyRefreshToken
};


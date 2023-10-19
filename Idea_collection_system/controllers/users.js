const Mysql = require("../models/_mysql");
const bcrypt = require("bcrypt");
const moment = require("moment");

const SALT_ROUNDS = 10; // for hashing

function formatDate(date) {
	return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

const createUser = (
	username,
	firstname,
	lastname,
	email,
	password,
	account_active = 1,
	hidden_posts_and_comments = 0,
	role_id,
	staff_type_id,
	department_id,
	cb,
) => {
	bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
		if (err) {
			return cb(err);
		}
		const query = `INSERT INTO users (username, firstname, lastname, email, password, account_active, registration_timestamp, hidden_posts_and_comments, role_id, staff_type_id, department_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		Mysql.connection.query(
			query,
			[
				username,
				firstname,
				lastname,
				email,
				hashedPassword,
				account_active,
				formatDate(Date.now()),
				hidden_posts_and_comments,
				role_id,
				staff_type_id,
				department_id,
			],
			(error, results) => {
				if (error) {
					console.log(new Date());
					return cb(error);
				}
				cb(null, results);
			},
		);
	});
};

const getUserByUsername = (username, cb) => {
	const query = `SELECT * FROM users WHERE username = ?`;
	Mysql.connection.query(query, [username], (error, results) => {
		if (error) {
			return cb(error);
		}
		cb(null, results[0]);
	});
};

const signup = (req, res) => {
	const { username, firstname, lastname, email, password, role_id = 1, staff_type_id, department_id } = req.body;

	if (!username || !firstname || !lastname || !email || !password || !role_id || !staff_type_id || !department_id) {
		return res.send({
			status: "FAILURE",
			message: "One or more fields missing",
		});
	} else {
		createUser(
			username, firstname, lastname, email, password, 1, 0, role_id, staff_type_id, department_id,
			(err, results) => {
				if (err) {
					console.log(err);
					return res.send({
						status: "FAILURE",
						message: "Error creating account",
					});
				} else {
					return res.send({
						status: "SUCCESS",
						message: "Account created successfully",
					});
				}
			},
		);
	}
};

const login = (req, res) => {
	const { username, password, appkey } = req.body;

	if (appkey != process.env.APP_KEY) {
		return res.send({
			status: "FAILURE",
			message: "Could not verify integrity of application...",
		});
	}

	if (!username || !password) {
		return res.send({
			status: "FAILURE",
			message: "One or more fields missing",
		});
	} else {
		getUserByUsername(username, (err, user) => {
			if (err) {
				return res.send({ message: "Error getting user", auth: false });
			}
			if (!user) {
				return res.send({ message: "User not found", auth: false });
			}

			if (user) {
				bcrypt.compare(password, user.password, (error, result) => {
					if (result && !error) {
						// const refreshToken = middleware.generateRefreshToken(user.username);

						// if (refreshToken == false) {
						// 	return res.send({
						// 		message: "Error creating token!",
						// 		auth: false,
						// 	});
						// }

						return res.send({
							"authenticated": true
						});
					} else {
						return res.send({
							authenticated: false,
						});
					}
				});
			}
		});
	}
};

module.exports = {
	signup,
	login
};

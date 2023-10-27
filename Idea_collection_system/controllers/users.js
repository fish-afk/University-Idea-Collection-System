const Mysql = require("../models/_mysql");
const bcrypt = require("bcrypt");
const moment = require("moment");
const authMiddleware = require('../middleware/auth_middleware')
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

const changePassword = (req, res) => {

	const { newPassword } = req.body;

	const username = req.decoded['username'];

	const query = `UPDATE users SET password = ? WHERE username = ?`

	bcrypt.hash(newPassword, SALT_ROUNDS, (err, hashedPassword) => { 

		if (err) {
			return res.status(500).send({
				status: "FAILURE",
				message: "Unknown error",
			});
		} else {
			Mysql.connection.query(query, [hashedPassword, username], (err, results) => {
				if (err) {
					return res.status(500).send({
						status: "FAILURE",
						message: "Unknown error",
					});
				} else {
					return res.status(200).send({
						status: "SUCCESS",
						message: "Password changed successfully !"
					})
				}
			})
		}
	})
}

const updateAccountDetails = (req, res) => {
	const { firstname, lastname, email, staff_type_id, department_id } = req.body;
	const username = req.decoded['username']

	const query = `UPDATE users SET firstname = ?, lastname = ?, email = ?, staff_type_id = ?, department_id = ? WHERE username = ?`;

	Mysql.connection.query(query, [firstname, lastname, email, staff_type_id, department_id, username], (err, results) => {
		if (err) {
			return res.status(500).send({
				status: "FAILURE",
				message: "Unknown error",
			});
		} else {
			return res.status(200).send({
				status: "SUCCESS",
				message: "Details updated successfully !",
			});
		}
	})
}

// only qa manager and above roles can do this

const disableAccount = (req, res) => {

	const { accountUsername } = req.body;

	const username = req.decoded['username']
	const privs = req.decoded['privs']

	if (privs != "admin" && privs != "qa_manager") {
		return res.status(401).send({ status: 'FAILURE', message: 'Insufficient privileges' })
		
	} else {
		const query = `UPDATE users SET account_active = 0 WHERE username = ?`

		Mysql.connection.query(query, [username], (err, results) => {
			if (err) {
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.status(200).send({
					status: "SUCCESS",
					message: "Account for user " + username + " has been disabled successfully",
				});
			}
		})
	}
}

// only qa manager and above roles can do this

const enableAccount = (req, res) => {
	const { accountUsername } = req.body;

	const username = req.decoded["username"];
	const privs = req.decoded["privs"];

	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `UPDATE users SET account_active = 1 WHERE username = ?`;

		Mysql.connection.query(query, [username], (err, results) => {
			if (err) {
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.status(200).send({
					status: "SUCCESS",
					message:
						"Account for user " + username + " has been enabled successfully",
				});
			}
		});
	}
};


const signup = (req, res) => {
	const {
		username,
		firstname,
		lastname,
		email,
		password,
		role_id = 1,
		staff_type_id,
		department_id,
	} = req.body;

	if (
		!username ||
		!firstname ||
		!lastname ||
		!email ||
		!password ||
		!role_id ||
		!staff_type_id ||
		!department_id
	) {
		return res.send({
			status: "FAILURE",
			message: "One or more fields missing",
		});
	} else {
		getUserByUsername(username.toLowerCase(), (err, user) => {
			if (err) {
				return res.send({
					status: "FAILURE",
					message: "Error looking up user",
					code: "102",
				});
			}

			if (!user) {
				createUser(
					username.toLowerCase(),
					firstname,
					lastname,
					email,
					password,
					1,
					0,
					role_id,
					staff_type_id,
					department_id,
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
			} else {
				return res.send({
					status: "FAILURE",
					message: "Username already exists",
				});
			}
		});
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
		getUserByUsername(username.toLowerCase(), (err, user) => {
			if (err) {
				return res.send({ message: "Error getting user", auth: false });
			}
			if (!user) {
				return res.send({ auth: false, message: "Incorrect credentials!" });
			}
			if (user) {
				bcrypt.compare(password, user.password, async (error, result) => {
					if (result && !error) {

						let privs = "staff";

						switch (user?.role_id) {
							case "1":
								privs = "staff";
							case "2":
								privs = "qa_coordinator";
							case "3":
								privs = "qa_manager";
							case "4":
								privs = "admin";
						}

						const jwtToken = authMiddleware.generateJwtToken(user.username, privs, "normal")
						const refreshToken = await authMiddleware.generateRefreshToken(user.username, privs);
						
						if (refreshToken == false || !jwtToken) {
							return res.send({
								message: "Error creating tokens!",
								auth: false,
							});
						} else {
							return res.send({
								auth: true,
								jwtToken,
								refreshToken,
							});
						}
					} else {
						return res.send({
							auth: false,
							message: "Incorrect credentials!",
						});
					}
				});
			}
		});
	}
};


const refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken;
	const username = req.body.username;

	if (!refreshToken || !username) {
		return res.send({ message: "No Token or no username provided" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};


module.exports = {
	signup,
	login,
	refresh,
	changePassword,
	updateAccountDetails,
	enableAccount,
	disableAccount
};

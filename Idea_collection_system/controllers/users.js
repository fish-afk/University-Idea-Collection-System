const Mysql = require("../models/_mysql");
const bcrypt = require("bcrypt");
const moment = require("moment");
const authMiddleware = require("../middleware/auth_middleware");
const SALT_ROUNDS = 10; // for hashing
const fs = require("fs");
const jwt = require("jsonwebtoken");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

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

	const username = req.decoded["username"];

	const query = `UPDATE users SET password = ? WHERE username = ?`;

	bcrypt.hash(newPassword, SALT_ROUNDS, (err, hashedPassword) => {
		if (err) {
			console.log(err);
			return res.status(500).send({
				status: "FAILURE",
				message: "Unknown error",
			});
		} else {
			Mysql.connection.query(
				query,
				[hashedPassword, username],
				(err, results) => {
					if (err) {
						console.log(err);
						return res.status(500).send({
							status: "FAILURE",
							message: "Unknown error",
						});
					} else {
						return res.status(200).send({
							status: "SUCCESS",
							message: "Password changed successfully !",
						});
					}
				},
			);
		}
	});
};

const updateAccountDetails = (req, res) => {
	const { firstname, lastname, email } = req.body;
	const username = req.decoded["username"];

	const query = `UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE username = ?`;

	Mysql.connection.query(
		query,
		[firstname, lastname, email, username],
		(err, results) => {
			if (err) {
				console.log(err);
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
		},
	);
};

// only qa manager and above roles can do this

const disableAccount = (req, res) => {
	const { accountUsername } = req.body;

	const privs = req.decoded["privs"];

	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `UPDATE users SET account_active = 0 WHERE username = ?`;

		Mysql.connection.query(query, [accountUsername], (err, results) => {
			if (err) {
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.status(200).send({
					status: "SUCCESS",
					message:
						"Account for user " +
						accountUsername +
						" has been disabled successfully",
				});
			}
		});
	}
};

// only qa manager and above roles can do this

const enableAccount = (req, res) => {
	const { accountUsername } = req.body;

	const privs = req.decoded["privs"];

	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `UPDATE users SET account_active = 1 WHERE username = ?`;

		Mysql.connection.query(query, [accountUsername], (err, results) => {
			if (err) {
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.status(200).send({
					status: "SUCCESS",
					message:
						"Account for user " +
						accountUsername +
						" has been enabled successfully",
				});
			}
		});
	}
};

const hidePostsAndComments = (req, res) => {
	const { accountUsername } = req.body;

	const privs = req.decoded["privs"];

	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `UPDATE users SET hidden_posts_and_comments = 1 WHERE username = ?`;

		Mysql.connection.query(query, [accountUsername], (err, results) => {
			if (err) {
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.status(200).send({
					status: "SUCCESS",
					message:
						"Posts And Comments for user " +
						accountUsername +
						" have been hidden successfully",
				});
			}
		});
	}
};

const UnhidePostsAndComments = (req, res) => {
	const { accountUsername } = req.body;

	const privs = req.decoded["privs"];

	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `UPDATE users SET hidden_posts_and_comments = 0 WHERE username = ?`;

		Mysql.connection.query(query, [accountUsername], (err, results) => {
			if (err) {
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.status(200).send({
					status: "SUCCESS",
					message:
						"Posts And Comments for user " +
						accountUsername +
						" have been revealed successfully",
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

	console.log(username);

	if (role_id !== 1) {
		const { high_priv_key = "" } = req.body;

		if (high_priv_key !== process.env.HIGH_PRIV_SIGNUP_KEY) {
			return res.send({
				status: "FAILURE",
				message: "High privilege signup key invalid",
			});
		}
	}

	if (role_id == 1) {
		if (!staff_type_id) {
			return res.send({
				status: "FAILURE",
				message: "One or more mandatory fields missing",
			});
		}
	}

	if (role_id == 1 || role_id == 2) {
		if (!department_id) {
			return res.send({
				status: "FAILURE",
				message: "One or more mandatory fields missing",
			});
		}
	}

	if (!username || !firstname || !lastname || !email || !password || !role_id) {
		return res.send({
			status: "FAILURE",
			message: "One or more mandatory fields missing",
		});
	} else {
		getUserByUsername(username.toLowerCase(), (err, user) => {
			if (err) {
				console.log(err);
				return res.send({
					status: "FAILURE",
					message: "Error looking up user",
					code: "102",
				});
			}

			if (!user) {
				if (role_id == 2 && department_id) {
					const query = `SELECT * FROM users WHERE department_id = ? AND role_id = 2`;
					Mysql.connection.query(query, [department_id], (err, results) => {
						if (err) {
							console.log(err);
							return res.send({
								status: "FAILURE",
								message: "Error looking up department check",
								code: "102",
							});
						} else {
							if (results.length > 0) {
								return res.send({
									status: "FAILURE",
									message: "A coordinator for this department already exists",
								});
							} else {
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
							}
						}
					});
				} else {
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
				}
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
				return res.send({
					status: "FAILURE",
					message: "Incorrect credentials!",
				});
			}
			if (user) {
				bcrypt.compare(password, user.password, async (error, result) => {
					if (result && !error) {
						let privs = "staff";

						if (user?.role_id == 1) {
							privs = "staff";
						}

						if (user?.role_id == 2) {
							privs = "qa_coordinator";
						}

						if (user?.role_id == 3) {
							privs = "qa_manager";
						}

						if (user?.role_id == 4) {
							privs = "admin";
						}

						const jwtToken = authMiddleware.generateJwtToken(
							user.username,
							privs,
							"normal",
						);
						const refreshToken = await authMiddleware.generateRefreshToken(
							user.username,
							privs,
						);

						if (refreshToken == false || !jwtToken) {
							return res.send({
								message: "Error creating tokens!",
								auth: false,
							});
						} else {
							const query = `UPDATE users SET last_log_in = ? WHERE username = ?`;
							Mysql.connection.query(
								query,
								[formatDate(Date.now()), username],
								(err, result) => {
									if (err) {
										console.log(err);
									}
								},
							);
							return res.send({
								auth: true,
								jwtToken,
								refreshToken,
							});
						}
					} else {
						return res.send({
							status: "FAILURE",
							message: "Incorrect credentials!",
						});
					}
				});
			}
		});
	}
};

const getUserData = (req, res) => {
	const username = req.decoded["username"];

	const query = `SELECT username, firstname, lastname, email, role_id, staff_type_id, department_id, last_log_in FROM users WHERE username = ?`;

	Mysql.connection.query(query, [username], (err, results) => {
		if (err || !results || results.length < 1) {
			console.log(err);
			return res.status(500).send({
				status: "FAILURE",
				message: "Unknown error",
			});
		} else {
			return res.send({
				status: "SUCCESS",
				data: results[0],
			});
		}
	});
};

const refresh = async (req, res) => {
	const refreshToken = req.body.refreshToken;
	const username = req.body.username;

	if (!refreshToken || !username) {
		return res.send({ message: "No Token or no username provided" });
	}
	await authMiddleware.verifyRefreshToken(refreshToken, username, res);
};

const getAllUsers = (req, res) => {
	const privs = req.decoded["privs"];
	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `SELECT username, firstname, lastname, email, role_id, staff_type_id, department_id, last_log_in, account_active, hidden_posts_and_comments FROM users`;
		Mysql.connection.query(query, [], (err, results) => {
			if (err) {
				console.log(err);
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.send({
					status: "SUCCESS",
					data: results,
				});
			}
		});
	}
};

const getallusersbydept = (req, res) => {
	const privs = req.decoded["privs"];
	const { department_id } = req.body;
	if (privs != "admin" && privs != "qa_manager" && privs != "qa_coordinator") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const query = `SELECT users.username, users.firstname, users.lastname, users.email, users.role_id, users.staff_type_id, users.department_id, users.last_log_in, users.account_active, users.hidden_posts_and_comments, COUNT(ideas.idea_id) AS ideas_posted
FROM
    users
LEFT JOIN ideas ON users.username = ideas.username
WHERE
    users.department_id = ?
GROUP BY
    users.username, users.firstname, users.lastname, users.department_id;`;
		Mysql.connection.query(query, [department_id], (err, results) => {
			if (err) {
				console.log(err);
				return res.status(500).send({
					status: "FAILURE",
					message: "Unknown error",
				});
			} else {
				return res.send({
					status: "SUCCESS",
					data: results,
				});
			}
		});
	}
};



function verifyJWT(username, token, expected_privs = [], res) {
	let status = true;
	if (!token || !username) {
		status = false;
		return res
			.status(401)
			.send({ status: false, message: "Missing auth fields !" });
	}
	// Verify the JWT and check that it is valid
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			status = false;
			return res.status(401).send({ status: false, message: err.message });
		}
		if (decoded.exp < Date.now() / 1000) {
			status = false;
			return res
				.status(401)
				.send({ status: false, message: "JWT has expired" });
		}

		if (!expected_privs.includes(decoded.privs)) {
			status = false;
			return res
				.status(401)
				.send({ status: false, message: "Insufficient privileges" });
		}

		// If the JWT is valid, save the decoded user information in the request object
		// so that it is available for the next middleware function
		if (decoded.username != username) {
			status = false;
			return res.status(401).send({ status: false, message: "Token mismatch" }); // Token is not this users, but another users
		}
	});

	return status;
}

// Define an endpoint to trigger the CSV export
const ExportCSV = (req, res) => {
	const username = req.query["username"];
	const token = req.query["token"];
	const table = req.query["table"];
	const expected_privs = ["admin", "qa_manager"];

	let status = verifyJWT(username, token, expected_privs, res);

	if (status != true) {
		return;
	}

	if (!table) {
		return res.send({ status: "FAILURE", message: "Table field required" });
	}
	try {
		const tableName = table; // Replace with your table name
		const csvFileName = "./common/exported_data.csv";

		// Query to get all data from the MySQL table
		const query = `SELECT * FROM ${tableName}`;

		Mysql.connection.query(query, (err, results) => {
			if (err) {
				console.error("Error executing query: " + err.stack);
				res.status(500).json({ error: "Internal Server Error" });
				return;
			}

			if (!results[0]) {
				return res.send({ status: "FAILURE", message: "Table empty" });
			}

			// Create a CSV writer
			const csvWriter = createCsvWriter({
				path: csvFileName,
				header: Object.keys(results[0]), // Assumes the table has columns with headers
			});

			// Write the data to the CSV file
			csvWriter
				.writeRecords(results)
				.then(() => {
					console.log(`CSV file "${csvFileName}" created successfully.`);
					res.download(csvFileName, (downloadError) => {
						if (downloadError) {
							console.error("Error downloading CSV: " + downloadError);
						}
						// Delete the CSV file after download
						fs.unlinkSync(csvFileName);
					});
				})
				.catch((writeError) => {
					console.error("Error writing to CSV: " + writeError);
					res.status(500).json({ error: "Internal Server Error" });
				});
		});
	} catch (err) {
		res.status(500).send("Error exporting tables: " + err.message);
	}
};

module.exports = {
	signup,
	login,
	refresh,
	changePassword,
	updateAccountDetails,
	enableAccount,
	disableAccount,
	getUserData,
	getAllUsers,
	hidePostsAndComments,
	UnhidePostsAndComments,
	ExportCSV,
	getallusersbydept,
};

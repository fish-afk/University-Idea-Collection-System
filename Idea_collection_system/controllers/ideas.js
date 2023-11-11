const Mysql = require("../models/_mysql");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const archiver = require('archiver');
const {
	getCurrentDate,
	hasClosurePassed,
} = require("../common/common_utils");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv")
dotenv.config()

//setup nodemailer for sending new idea post and new comment emails
const transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.GMAIL_EMAIL,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

function formatDate(date) {
	return moment(date).format("YYYY-MM-DD HH:mm:ss");
}


const checkIFBanned = (username) => {
	return new Promise((resolve, reject) => {
		// Replace this with your other database query
		const query = `SELECT * FROM users WHERE username = ? AND account_active = 0`;
		Mysql.connection.query(query, [username], (err, results) => {
			if (err) {
				console.log(err)
				reject("Db error");
			} else {
			
				resolve(results);
			}
		});
	});
};

// Create an idea
const newIdeaPost = async (req, res) => {
	const todaysDate = getCurrentDate();
	const hasClosurePassed_ = hasClosurePassed(
		todaysDate,
		process.env.CLOSURE_DATE,
	);
	const username = req.decoded["username"];

	try {
		const [checkIFBannedrecord] = await Promise.all([checkIFBanned(username)]);
		if (checkIFBannedrecord.length > 0) {
			return res.send({
				status: "FAILURE",
				message: "You have been banned from posting new ideas and comments",
			});
		}

		if (hasClosurePassed_ == true) {
			return res.send({
				status: "FAILURE",
				message:
					"Sorry, The closure date for ideas has passed for this academic year, and ideas can no longer be posted",
			});
		}

		const {
			idea_title,
			idea_body,
			date_and_time_posted_on = formatDate(Date.now()),
			category_id,
			post_is_anonymous,
		} = req.body;

		const query =
			"INSERT INTO ideas (idea_title, idea_body, date_and_time_posted_on, category_id, post_is_anonymous, username) VALUES (?, ?, ?, ?, ?, ?)";
		Mysql.connection.query(
			query,
			[
				idea_title,
				idea_body,
				date_and_time_posted_on,
				category_id,
				post_is_anonymous,
				username,
			],
			(err, result) => {
				if (err) {
					console.error("Error creating an idea:", err);
					res
						.status(500)
						.send({ status: "FAILURE", message: "Error creating an idea" });
				} else {
					const query1 = `SELECT * FROM users WHERE username = ?`;

					Mysql.connection.query(query1, [username], (err, results) => {
						if (err) {
							console.log(err);
							return res.send({
								status: "FAILURE",
								message: "Unknown error",
							});
						} else {
							const record = results[0];
							const department_id = record?.department_id;

							const query2 = `SELECT * FROM users WHERE department_id = ? AND role_id = 2`;

							Mysql.connection.query(
								query2,
								[department_id],
								async (err, results) => {
									if (err) {
										console.log(err);
										return res.send({
											status: "FAILURE",
											message: "Unknown error",
										});
									} else {
										const record2 = results[0];
										const email = record2?.email;

										if (email) {
											const info = await transport.sendMail({
												to: email, // list of receivers
												subject: "New idea post on your department", // Subject line
												text:
													"A new idea was posted on your department by the user: " +
													username, // plain text body
											});
											console.log(info);
										}

										return res.status(201).json({
											status: "SUCCESS",
											message: "Idea created successfully",
											idea_id: result?.insertId,
										});
									}
								},
							);
						}
					});
				}
			},
		);
	} catch (error) {
		console.log(error);
		return res.send({ status: "FAILURE", message: "Unknown error" });
	}
};

function setNewClosureDates(req, res) {
	const privs = req.decoded["privs"];

	if (privs != "admin") {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		const { newClosureDate, newFinalClosureDate } = req.body;

		if (!newClosureDate || !newFinalClosureDate) {
			return res.send({ status: "FAILURE", message: "Missing details" });
		} else {
			fs.writeFileSync("./common/closure.txt", newClosureDate, "utf8");
			fs.writeFileSync("./common/final_closure.txt", newFinalClosureDate, "utf8");
			
			return res.send({
				status: "SUCCESS",
				message: "Set new closure date successfully",
			});
		}
	}
}

function getClosureDates(req, res) {
	const privs = req.decoded["privs"];

	if (privs != "admin" && privs != 'qa_manager') {
		return res
			.status(401)
			.send({ status: "FAILURE", message: "Insufficient privileges" });
	} else {
		return res.send({
			status: "SUCCESS",
			closure_date: fs.readFileSync("./common/closure.txt", "utf8"),
			final_closure_date: fs.readFileSync("./common/final_closure.txt", "utf8"),
		});
	}
}

function getDocumentFile(req, res) {
	const Filename = req.query.filename;
	const token = req.query.token;
	const username = req.query.username;
	const expected_privs = ["admin", "qa_manager", "staff", "qa_coordinator"];

	let status = verifyJWT(username, token, expected_privs, res);

	if (status != true) {
		return;
	}

	if (Filename == undefined) {
		return res
			.status(400)
			.send({ status: false, message: "Please specify a filename" });
	}
	const staticFolder = path.join(__dirname, "../uploads");
	const filePath = path.resolve(path.join(staticFolder, Filename));

	if (!filePath.startsWith(staticFolder)) {
		res.status(403).send({ status: false, message: "Forbidden" });
		return;
	} else {
		res.sendFile(filePath, (err) => {
			if (err) {
				res.status(404).send({ status: false, message: "File not found" });
			}
		});
	}
}

const getAllfilesForIdea_Zipped = (req, res) => {


	const username = req.query['username']
	const token = req.query['token']
	const expected_privs = ['admin', 'qa_manager']

	let status = verifyJWT(username, token, expected_privs, res);

	if (status != true) {
		return;
	}

  const sourceFolderPath = './uploads'; // Change this to the path of your uploads folder

  const outputZipFileName = 'Documents.zip';
  const outputZipFilePath = `./${outputZipFileName}`;

  // Create a write stream to save the zip file
  const output = fs.createWriteStream(outputZipFilePath);

  // Create a new archiver instance
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level (0-9)
  });

  // Pipe the archive data to the output stream
  archive.pipe(output);

  // Add all files from the source folder to the archive
  archive.directory(sourceFolderPath, false);

  // Finalize the archive
  archive.finalize();

  output.on('close', () => {
    res.setHeader('Content-Disposition', `attachment; filename=${outputZipFileName}`);
    res.setHeader('Content-Type', 'application/zip');

    const zipStream = fs.createReadStream(outputZipFilePath);
    zipStream.pipe(res);
  });

  output.on('error', (err) => {
    console.error('Error zipping files:', err);
    res.status(500).send('Error zipping files.');
  });
}

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
			return res.status(401).send({ status: false, message: "Insufficient privileges" });
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

function uploadIdeaDocument(req, res) {
	const username = req.body["username"];
	const jwt_key = req.body["jwt_key"];
	const expected_privs = ["admin", "qa_manager", "staff", "qa_coordinator"];

	let status = verifyJWT(username, jwt_key,expected_privs, res);

	if (status != true) {
		return;
	}

	const idea_id = req.body["idea_id"];
	if (!idea_id) {
		res.status(400).send({ status: false, message: "Idea Id Required." });
		return;
	}
	if (!req.file) {
		res.status(400).send({ status: false, message: "No file uploaded." });
		return;
	} else {
		const filename = req.file.filename;
		if (filename) {
			const query = `INSERT INTO idea_documents (filename, idea_id) VALUES (?, ?)`;
			Mysql.connection.query(query, [filename, idea_id], (err, results) => {
				if (err || !results) {
					console.log(err);
					return res.status(500).send({
						status: "FAILURE",
						message:
							"Internal error: either the idea_id doesnt exist or some other error occured..",
					});
				} else {
					return res
						.status(200)
						.send({ status: true, message: "File uploaded successfully." });
				}
			});
		}
	}
}

function getIdeaDocuments(req, res) {
	const idea_id = req.body["idea_id"];

	if (!idea_id) {
		return res.send({ status: "FAILURE", message: "Missing idea id" });
	} else {
		const query = `SELECT * FROM idea_documents WHERE idea_id = ?`;

		Mysql.connection.query(query, [idea_id], (err, results) => {
			if (err || !results) {
				console.log(err);
				return res
					.status(500)
					.send({ status: "FAILURE", message: "Internal error" });
			} else {
				return res.send({ status: "SUCCESS", data: results });
			}
		});
	}
}

// like post

const likePost = (req, res) => {
	const username = req.decoded["username"];
	const { idea_id } = req.body;

	if (!username || !idea_id) {
		return res.send({ status: "FAILURE", message: "Missing fields" });
	} else {
		const query = `SELECT * FROM likes_and_dislikes WHERE username = ? AND idea_id = ?`;

		Mysql.connection.query(query, [username, idea_id], (err, results) => {
			if (err) {
				console.log(err);
				return res
					.status(500)
					.send({ status: "FAILURE", message: "Internal error" });
			}
			if (results?.length > 0) {
				const query2 = `UPDATE likes_and_dislikes SET like_or_dislike = 1 WHERE username = ? AND idea_id = ?`;
				Mysql.connection.query(query2, [username, idea_id], (err, results) => {
					if (err) {
						console.log(err);
						return res
							.status(500)
							.send({ status: "FAILURE", message: "Internal error" });
					} else {
						return res.send({
							status: "SUCCESS",
							message: "Liked Idea id: " + idea_id,
						});
					}
				});
			} else {
				const query2 = `INSERT INTO likes_and_dislikes (like_or_dislike, idea_id, username) VALUES (?, ?, ?)`;
				Mysql.connection.query(
					query2,
					[1, idea_id, username],
					(err, results) => {
						if (err) {
							console.log(err);
							return res
								.status(500)
								.send({ status: "FAILURE", message: "Internal error" });
						} else {
							return res.send({
								status: "SUCCESS",
								message: "Liked Idea id: " + idea_id,
							});
						}
					},
				);
			}
		});
	}
};

//dislike post

const dislikePost = (req, res) => {
	const username = req.decoded["username"];
	const { idea_id } = req.body;

	if (!username || !idea_id) {
		return res.send({ status: "FAILURE", message: "Missing fields" });
	} else {
		const query = `SELECT * FROM likes_and_dislikes WHERE username = ? AND idea_id = ?`;

		Mysql.connection.query(query, [username, idea_id], (err, results) => {
			if (err) {
				console.log(err);
				return res
					.status(500)
					.send({ status: "FAILURE", message: "Internal error" });
			}
			if (results?.length > 0) {
				const query2 = `UPDATE likes_and_dislikes SET like_or_dislike = 0 WHERE username = ? AND idea_id = ?`;
				Mysql.connection.query(query2, [username, idea_id], (err, results) => {
					if (err) {
						console.log(err);
						return res
							.status(500)
							.send({ status: "FAILURE", message: "Internal error" });
					} else {
						return res.send({
							status: "SUCCESS",
							message: "DisLiked Idea id: " + idea_id,
						});
					}
				});
			} else {
				const query2 = `INSERT INTO likes_and_dislikes (like_or_dislike, idea_id, username) VALUES (?, ?, ?)`;
				Mysql.connection.query(
					query2,
					[0, idea_id, username],
					(err, results) => {
						if (err) {
							console.log(err);
							return res
								.status(500)
								.send({ status: "FAILURE", message: "Internal error" });
						} else {
							return res.send({
								status: "SUCCESS",
								message: "DisLiked Idea id: " + idea_id,
							});
						}
					},
				);
			}
		});
	}
};

// Read all ideas
const getAllIdeas = (req, res) => {
	const query = `SELECT
    ideas.idea_id,
    ideas.idea_title,
    ideas.idea_body,
    ideas.date_and_time_posted_on,
    ideas.post_is_anonymous,
    ideas.username AS username,
    idea_categories.name AS category_name,
    idea_documents.filename AS idea_documents,
    IFNULL(SUM(likes_and_dislikes.like_or_dislike = 1), 0) AS num_likes,
    IFNULL(SUM(likes_and_dislikes.like_or_dislike = 0), 0) AS num_dislikes,
    users.hidden_posts_and_comments
FROM
    ideas
JOIN idea_categories ON ideas.category_id = idea_categories.category_id
LEFT JOIN idea_documents ON ideas.idea_id = idea_documents.idea_id
LEFT JOIN likes_and_dislikes ON ideas.idea_id = likes_and_dislikes.idea_id
LEFT JOIN users ON ideas.username = users.username
GROUP BY
    ideas.idea_id;
`;
	Mysql.connection.query(query, (err, results) => {
		if (err) {
			console.error("Error fetching ideas:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching ideas" });
		} else {
			res.status(200).json({ status: "SUCCESS", data: results });
		}
	});
};



// Read a single idea by idea_id
const getIdeaById = (req, res) => {
	const idea_id = req.query.idea_id;
	const query = "SELECT * FROM ideas WHERE idea_id = ?";
	Mysql.connection.query(query, [idea_id], (err, results) => {
		if (err) {
			console.error("Error fetching idea:", err);
			res.status(500).send("Error fetching idea");
		} else {
			if (results.length > 0) {
				res.status(200).json({ status: "SUCCESS", data: results[0] });
			} else {
				res.status(404).send({ status: "FAILURE", message: "Idea not found" });
			}
		}
	});
};

// Update an idea by idea_id
const updateIdeaByID = (req, res) => {
	const idea_id = req.body.idea_id;
	const {
		idea_title,
		idea_body,
		date_and_time_posted_on,
		category_id,
		post_is_anonymous,
		username,
	} = req.body;
	const query =
		"UPDATE ideas SET idea_title = ?, idea_body = ?, date_and_time_posted_on = ?, category_id = ?, post_is_anonymous = ?, username = ? WHERE idea_id = ?";
	Mysql.connection.query(
		query,
		[
			idea_title,
			idea_body,
			date_and_time_posted_on,
			category_id,
			post_is_anonymous,
			username,
			idea_id,
		],
		(err, results) => {
			if (err) {
				console.error("Error updating idea:", err);
				res
					.status(500)
					.send({ status: "FAILURE", message: "Error updating idea" });
			} else {
				res
					.status(200)
					.json({ status: "SUCCESS", message: "Idea updated successfully" });
			}
		},
	);
};

// Delete an idea by idea_id
const deleteIdeaById = (req, res) => {
	const idea_id = req.body.idea_id;
	const query = "DELETE FROM ideas WHERE idea_id = ?";
	Mysql.connection.query(query, [idea_id], (err, results) => {
		if (err) {
			console.error("Error deleting idea:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error deleting idea" });
		} else {
			res
				.status(200)
				.json({ status: "SUCCESS", message: "Idea deleted successfully" });
		}
	});
};

module.exports = {
	newIdeaPost,
	getAllIdeas,
	getIdeaById,
	updateIdeaByID,
	deleteIdeaById,
	uploadIdeaDocument,
	getIdeaDocuments,
	getDocumentFile,
	likePost,
	dislikePost,
	setNewClosureDates,
	getClosureDates,
	getAllfilesForIdea_Zipped
};

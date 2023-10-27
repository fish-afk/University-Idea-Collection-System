const Mysql = require("../models/_mysql")
const path = require('path')
const nodemailer = require("nodemailer");

require('dotenv').config()

//setup nodemailer for sending new idea post and new comment emails
const transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.GMAIL_EMAIL,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});


// Create an idea
const newIdeaPost = (req, res) => {
	const {
		idea_title,
		idea_body,
		date_and_time_posted_on,
		category_id,
		post_is_anonymous,
		username,
	} = req.body;
    
	const query =
		"INSERT INTO ideas (idea_title, idea_body, date_and_time_posted_on, category_id, post_is_anonymous, username) VALUES (?, ?, ?, ?, ?)";
	Mysql.connection.query(
		query,
		[idea_title, idea_body, date_and_time_posted_on, category_id, post_is_anonymous, username],
		(err, results) => {
			if (err) {
				console.error("Error creating an idea:", err);
                res.status(500).send({ status: "FAILURE", message: "Error creating an idea" });
			} else {
				res
					.status(201)
					.json({ status: "SUCCESS", message: "Idea created successfully" });
			}
		},
	);
}

function getDocumentFile(req, res) {
	const Filename = req.query.filename;
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

function uploadIdeaDocument(req, res) {
	if (!req.file) {
		res.status(400).send({ status: false, message: "No file uploaded." });
		return;
	} else {
		const filename = req.file.filename;
		if (filename) {
			const query = `INSERT INTO idea_documents (filename, idea_id) VALUES (?, ?)`;
			Mysql.connection.query(query, [filename, req.body.idea_id], (err, results) => {
				if (err || !results) {
					console.log(err)
					return res.status(500).send({status: "FAILURE", message: 'Internal error'})
				} else {
					return res
						.status(200)
						.send({ status: true, message: "File uploaded successfully." });
				}
			})
		}
	}
}

function getIdeaDocuments(req, res) {
	const idea_id = req.body['idea_id']

	if (!idea_id) {
		return res.send({status: "FAILURE", message: 'Missing idea id'})
	} else {
		const query = `SELECT * FROM idea_documents WHERE idea_id = ?`

		Mysql.connection.query(query, [idea_id], (err, results) => {
			if (err || !results) {
				console.log(err)
				return res.status(500).send({ status: "FAILURE", message: 'Internal error' })
			} else {
				return res.send({status: "SUCCESS", data: results})
			}
		})
	}
}

// like post

const likePost = (req, res) => {
	const username = req.decoded['username'];
	const { idea_id } = req.body;

	if (!username || !idea_id) {
		return res.send({status: "FAILURE", message: "Missing fields"})
	} else {
		const query = `SELECT * FROM likes_and_dislikes WHERE username = ? AND idea_id = ?`;

		Mysql.connection.query(query, [username, idea_id], (err, results) => {
			if (err) {
				console.log(err)
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
							message: "Liked Idea id: " + idea_id
						})
					}
				})
			} else {
				const query2 = `INSERT INTO likes_and_dislikes (like_or_dislike, idea_id, username) VALUES (?, ?, ?)`;
				Mysql.connection.query(query2, [1, idea_id, username], (err, results) => {
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
			}
		})
	}
}

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
							message: "Liked Idea id: " + idea_id,
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
								message: "Liked Idea id: " + idea_id,
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
	const query = "SELECT * FROM ideas";
	Mysql.connection.query(query, (err, results) => {
		if (err) {
			console.error("Error fetching ideas:", err);
            res.status(500).send({ status: "FAILURE", message: "Error fetching ideas" });
		} else {
            res.status(200).json({ status: "SUCCESS", data: results });
		}
	});
}

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
}

// Update an idea by idea_id
const updateIdeaByID = (req, res) => {
	const idea_id = req.params.idea_id;
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
}

// Delete an idea by idea_id
const deleteIdeaById = (req, res) => {
	const idea_id = req.params.idea_id;
	const query = "DELETE FROM ideas WHERE idea_id = ?";
	Mysql.connection.query(query, [idea_id], (err, results) => {
		if (err) {
			console.error("Error deleting idea:", err);
            res.status(500).send({ status: "FAILURE", message: "Error deleting idea" });
		} else {
			res
				.status(200)
				.json({ status: "SUCCESS", message: "Idea deleted successfully" });
		}
	});
}

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
	dislikePost
}

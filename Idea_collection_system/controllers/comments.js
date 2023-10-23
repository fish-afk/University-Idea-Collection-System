const Mysql = require("../models/_mysql");

// Create a comment
const newCommentPost = (req, res) => {
	const {
		comment,
		date_and_time_posted_on,
		post_is_anonymous,
		idea_id,
		username,
	} = req.body;

	const query =
		"INSERT INTO comments (comment, date_and_time_posted_on, post_is_anonymous, idea_id, username) VALUES (?, ?, ?, ?, ?)";
	Mysql.connection.query(
		query,
		[comment, date_and_time_posted_on, post_is_anonymous, idea_id, username],
		(err, results) => {
			if (err) {
				console.error("Error creating a comment:", err);
				res
					.status(500)
					.send({ status: "FAILURE", message: "Error creating a comment" });
			} else {
				res
					.status(201)
					.json({ status: "SUCCESS", message: "Comment created successfully" });
			}
		},
	);
};

// Read all comments for a specific idea
const getCommentsByIdeaId = (req, res) => {
	const idea_id = req.query.idea_id;
	const query = "SELECT * FROM comments WHERE idea_id = ?";
	Mysql.connection.query(query, [idea_id], (err, results) => {
		if (err) {
			console.error("Error fetching comments:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching comments" });
		} else {
			res.status(200).json({ status: "SUCCESS", data: results });
		}
	});
};

// Read a single comment by comment_id
const getCommentById = (req, res) => {
	const comment_id = req.query.comment_id;
	const query = "SELECT * FROM comments WHERE comment_id = ?";
	Mysql.connection.query(query, [comment_id], (err, results) => {
		if (err) {
			console.error("Error fetching comment:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching comment" });
		} else {
			if (results.length > 0) {
				res.status(200).json({ status: "SUCCESS", data: results[0] });
			} else {
				res
					.status(404)
					.send({ status: "FAILURE", message: "Comment not found" });
			}
		}
	});
};

// Update a comment by comment_id
const updateCommentById = (req, res) => {
	const comment_id = req.params.comment_id;
	const {
		comment,
		date_and_time_posted_on,
		post_is_anonymous,
		idea_id,
		username,
	} = req.body;
	const query =
		"UPDATE comments SET comment = ?, date_and_time_posted_on = ?, post_is_anonymous = ?, idea_id = ?, username = ? WHERE comment_id = ?";
	Mysql.connection.query(
		query,
		[
			comment,
			date_and_time_posted_on,
			post_is_anonymous,
			idea_id,
			username,
			comment_id,
		],
		(err, results) => {
			if (err) {
				console.error("Error updating comment:", err);
				res
					.status(500)
					.send({ status: "FAILURE", message: "Error updating comment" });
			} else {
				res
					.status(200)
					.json({ status: "SUCCESS", message: "Comment updated successfully" });
			}
		},
	);
};

// Delete a comment by comment_id
const deleteCommentById = (req, res) => {
	const comment_id = req.params.comment_id;
	const query = "DELETE FROM comments WHERE comment_id = ?";
	Mysql.connection.query(query, [comment_id], (err, results) => {
		if (err) {
			console.error("Error deleting comment:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error deleting comment" });
		} else {
			res
				.status(200)
				.json({ status: "SUCCESS", message: "Comment deleted successfully" });
		}
	});
};

module.exports = {
	newCommentPost,
	getCommentsByIdeaId,
	getCommentById,
	updateCommentById,
	deleteCommentById,
};

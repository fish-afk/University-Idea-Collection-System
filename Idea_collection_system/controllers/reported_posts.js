const Mysql = require("../models/_mysql");
const moment = require('moment')


function formatDate(date) {
	return moment(date).format("YYYY-MM-DD HH:mm:ss");
}


// Create a new reported post
const newReportedPost = (req, res) => {
    const username = req.decoded['username']
	const { report, report_date_time = formatDate(Date.now()), idea_id } = req.body;

	const query =
		"INSERT INTO reported_posts (report, report_date_time, idea_id, username) VALUES (?, ?, ?, ?)";
	Mysql.connection.query(
		query,
		[report, report_date_time, idea_id, username],
		(err, results) => {
			if (err) {
				console.error("Error creating a reported post:", err);
				res.status(500).send({
					status: "FAILURE",
					message: "Error reporting post",
				});
			} else {
				res.status(201).json({
					status: "SUCCESS",
					message: "Reported post successfully",
				});
			}
		},
	);
};

// Read all reported posts
const getAllReportedPosts = (req, res) => {
	const query = "SELECT * FROM reported_posts";
	Mysql.connection.query(query, (err, results) => {
		if (err) {
			console.error("Error fetching reported posts:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching reported posts" });
		} else {
			res.status(200).json({ status: "SUCCESS", data: results });
		}
	});
};

// Read a single reported post by report_id
const getReportedPostById = (req, res) => {
	const report_id = req.query.report_id;
	const query = "SELECT * FROM reported_posts WHERE report_id = ?";
	Mysql.connection.query(query, [report_id], (err, results) => {
		if (err) {
			console.error("Error fetching reported post:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching reported post" });
		} else {
			if (results.length > 0) {
				res.status(200).json({ status: "SUCCESS", data: results[0] });
			} else {
				res
					.status(404)
					.send({ status: "FAILURE", message: "Reported post not found" });
			}
		}
	});
};

// Read a single reported post by idea_id
const getReportedPostByIdeaId = (req, res) => {
	const report_id = req.query.report_id;
	const query = "SELECT * FROM reported_posts WHERE idea_id = ?";
	Mysql.connection.query(query, [report_id], (err, results) => {
		if (err) {
			console.error("Error fetching reported post:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching reported post" });
		} else {
			if (results.length > 0) {
				res.status(200).json({ status: "SUCCESS", data: results[0] });
			} else {
				res
					.status(404)
					.send({ status: "FAILURE", message: "Reported post not found" });
			}
		}
	});
};

// Update a reported post by report_id
const updateReportedPostById = (req, res) => {
	const report_id = req.params.report_id;
	const { report, report_date_time, idea_id, username } = req.body;
	const query =
		"UPDATE reported_posts SET report = ?, report_date_time = ?, idea_id = ?, username = ? WHERE report_id = ?";
	Mysql.connection.query(
		query,
		[report, report_date_time, idea_id, username, report_id],
		(err, results) => {
			if (err) {
				console.error("Error updating reported post:", err);
				res
					.status(500)
					.send({ status: "FAILURE", message: "Error updating reported post" });
			} else {
				res.status(200).json({
					status: "SUCCESS",
					message: "Reported post updated successfully",
				});
			}
		},
	);
};

// Delete a reported post by report_id
const deleteReportedPostById = (req, res) => {
	const report_id = req.params.report_id;
	const query = "DELETE FROM reported_posts WHERE report_id = ?";
	Mysql.connection.query(query, [report_id], (err, results) => {
		if (err) {
			console.error("Error deleting reported post:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error deleting reported post" });
		} else {
			res.status(200).json({
				status: "SUCCESS",
				message: "Reported post deleted successfully",
			});
		}
	});
};

module.exports = {
	newReportedPost,
	getAllReportedPosts,
	getReportedPostById,
	updateReportedPostById,
    deleteReportedPostById,
    getReportedPostByIdeaId
};

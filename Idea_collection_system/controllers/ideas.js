const Mysql = require("../models/_mysql")

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
    deleteIdeaById
}

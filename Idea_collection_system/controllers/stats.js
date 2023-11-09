const Mysql = require("../models/_mysql");

const getAnonymousIdeas = () => {
	return new Promise((resolve, reject) => {
		const query = `SELECT COUNT(*) FROM ideas WHERE post_is_anonymous = 1`;
		Mysql.connection.query(query, [], (err, results) => {
			if (err) {
				reject("Db error");
			} else {
				resolve(results[0]["COUNT(*)"]);
			}
		});
	});
};

const getIdeasWithoutComments = () => {
	return new Promise((resolve, reject) => {
		const query = `SELECT COUNT(ideas.idea_id) AS ideas_without_comments
                        FROM ideas
                        LEFT JOIN comments ON ideas.idea_id = comments.idea_id
                        WHERE comments.idea_id IS NULL;
                        `;
		Mysql.connection.query(query, [], (err, results) => {
			if (err) {
				reject("Db error");
			} else {
				resolve(results[0]["ideas_without_comments"]);
			}
		});
	});
};

const getAnonymousComments = () => {
	return new Promise((resolve, reject) => {
		// Replace this with your other database query
		const query = `SELECT COUNT(*) FROM comments WHERE post_is_anonymous = 1`;
		Mysql.connection.query(query, [], (err, results) => {
			if (err) {
				reject("Db error");
			} else {
				resolve(results[0]["COUNT(*)"]);
			}
		});
	});
};

const getIdeasPerDepartment = () => {
	return new Promise((resolve, reject) => {
		const query = `SELECT
                                d.department_id,
                                d.name AS department_name,
                                COUNT(i.idea_id) AS ideas_count
                            FROM
                                departments AS d
                            LEFT JOIN
                                users AS u ON d.department_id = u.department_id
                            LEFT JOIN
                                ideas AS i ON u.username = i.username
                            GROUP BY
                                d.department_id, d.name
                            ORDER BY
                                d.department_id;`;
		Mysql.connection.query(query, [], (err, results) => {
			if (err) {
				reject("Db error");
			} else {
				resolve(results[0]);
			}
		});
	});
};

const getContributorsPerDepartment = () => {
    return new Promise((resolve, reject) => {
			const query = `SELECT
                                d.department_id,
                                d.name AS department_name,
                                COUNT(DISTINCT u.username) AS contributors_count
                            FROM
                                departments AS d
                            LEFT JOIN
                                users AS u ON d.department_id = u.department_id
                            LEFT JOIN
                                ideas AS i ON u.username = i.username
                            GROUP BY
                                d.department_id, d.name
                            ORDER BY
                                d.department_id;
                            `;
			Mysql.connection.query(query, [], (err, results) => {
				if (err) {
					reject("Db error");
				} else {
					resolve(results[0]);
				}
			});
		});
}

const getAllStats = async (req, res) => {
	const privs = req.decoded["privs"]; // Assuming you have the user's privileges in req.user

	if (privs != "admin" && privs != "qa_manager") {
		return res
			.status(401)
			.json({ status: "FAILURE", message: "Insufficient privileges" });
	}

	try {
		const [
			anonymousIdeasCount,
			anonymousCommentsCount,
			ideasWithoutComments,
            ideasPerDepartment,
            ContributorsPerDepartment
		] = await Promise.all([
			getAnonymousIdeas(),
			getAnonymousComments(),
			getIdeasWithoutComments(),
            getIdeasPerDepartment(),
            getContributorsPerDepartment()
		]);

		// Combine the results and send them back to the user
		const combinedResults = {
			anonymousIdeasCount,
			anonymousCommentsCount,
			ideasWithoutComments,
            ideasPerDepartment,
            ContributorsPerDepartment
		};
		res.status(200).json(combinedResults);
	} catch (error) {
		console.log(error);
		return res.send({ status: "FAILURE", message: "Unknown error" });
	}
};

module.exports = {
	getAllStats,
};

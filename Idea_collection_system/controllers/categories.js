const Mysql = require("../models/_mysql");

// Create a new category
const newCategory = (req, res) => {
	const { name, description } = req.body;

	const query = "INSERT INTO idea_categories (name, description) VALUES (?, ?)";
	Mysql.connection.query(query, [name, description], (err, results) => {
		if (err) {
			console.error("Error creating a category:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error creating a category" });
		} else {
			res
				.status(201)
				.json({ status: "SUCCESS", message: "Category created successfully" });
		}
	});
};

// Read all categories
const getAllCategories = (req, res) => {
	const query = "SELECT * FROM idea_categories";
	Mysql.connection.query(query, (err, results) => {
		if (err) {
			console.error("Error fetching categories:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching categories" });
		} else {
			res.status(200).json({ status: "SUCCESS", data: results });
		}
	});
};

// Read a single category by category_id
const getCategoryById = (req, res) => {
	const category_id = req.query.category_id;
	const query = "SELECT * FROM idea_categories WHERE category_id = ?";
	Mysql.connection.query(query, [category_id], (err, results) => {
		if (err) {
			console.error("Error fetching category:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching category" });
		} else {
			if (results.length > 0) {
				res.status(200).json({ status: "SUCCESS", data: results[0] });
			} else {
				res
					.status(404)
					.send({ status: "FAILURE", message: "Category not found" });
			}
		}
	});
};

// Update a category by category_id
const updateCategoryById = (req, res) => {
	const category_id = req.params.category_id;
	const { name, description } = req.body;
	const query =
		"UPDATE idea_categories SET name = ?, description = ? WHERE category_id = ?";
	Mysql.connection.query(
		query,
		[name, description, category_id],
		(err, results) => {
			if (err) {
				console.error("Error updating category:", err);
				res
					.status(500)
					.send({ status: "FAILURE", message: "Error updating category" });
			} else {
				res
					.status(200)
					.json({
						status: "SUCCESS",
						message: "Category updated successfully",
					});
			}
		},
	);
};

// Delete a category by category_id
const deleteCategoryById = (req, res) => {
	const category_id = req.params.category_id;
	const query = "DELETE FROM idea_categories WHERE category_id = ?";
	Mysql.connection.query(query, [category_id], (err, results) => {
		if (err) {
			console.error("Error deleting category:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error deleting category" });
		} else {
			res
				.status(200)
				.json({ status: "SUCCESS", message: "Category deleted successfully" });
		}
	});
};

module.exports = {
	newCategory,
	getAllCategories,
	getCategoryById,
	updateCategoryById,
	deleteCategoryById,
};

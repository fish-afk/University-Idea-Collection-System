const Mysql = require("../models/_mysql");

// Create a new department
const newDepartment = (req, res) => {
	const { name, description } = req.body;

	const query = "INSERT INTO departments (name, description) VALUES (?, ?)";
	Mysql.connection.query(query, [name, description], (err, results) => {
		if (err) {
			console.error("Error creating a department:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error creating a department" });
		} else {
			res
				.status(201)
				.json({
					status: "SUCCESS",
					message: "Department created successfully",
				});
		}
	});
};

// Read all departments
const getAllDepartments = (req, res) => {
	const query = "SELECT * FROM departments";
	Mysql.connection.query(query, (err, results) => {
		if (err) {
			console.error("Error fetching departments:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching departments" });
		} else {
			res.status(200).json({ status: "SUCCESS", data: results });
		}
	});
};

// Read a single department by department_id
const getDepartmentById = (req, res) => {
	const department_id = req.query.department_id;
	const query = "SELECT * FROM departments WHERE department_id = ?";
	Mysql.connection.query(query, [department_id], (err, results) => {
		if (err) {
			console.error("Error fetching department:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error fetching department" });
		} else {
			if (results.length > 0) {
				res.status(200).json({ status: "SUCCESS", data: results[0] });
			} else {
				res
					.status(404)
					.send({ status: "FAILURE", message: "Department not found" });
			}
		}
	});
};

// Update a department by department_id
const updateDepartmentById = (req, res) => {
	const department_id = req.params.department_id;
	const { name, description } = req.body;
	const query =
		"UPDATE departments SET name = ?, description = ? WHERE department_id = ?";
	Mysql.connection.query(
		query,
		[name, description, department_id],
		(err, results) => {
			if (err) {
				console.error("Error updating department:", err);
				res
					.status(500)
					.send({ status: "FAILURE", message: "Error updating department" });
			} else {
				res
					.status(200)
					.json({
						status: "SUCCESS",
						message: "Department updated successfully",
					});
			}
		},
	);
};

// Delete a department by department_id
const deleteDepartmentById = (req, res) => {
	const department_id = req.params.department_id;
	const query = "DELETE FROM departments WHERE department_id = ?";
	Mysql.connection.query(query, [department_id], (err, results) => {
		if (err) {
			console.error("Error deleting department:", err);
			res
				.status(500)
				.send({ status: "FAILURE", message: "Error deleting department" });
		} else {
			res
				.status(200)
				.json({
					status: "SUCCESS",
					message: "Department deleted successfully",
				});
		}
	});
};

module.exports = {
	newDepartment,
	getAllDepartments,
	getDepartmentById,
	updateDepartmentById,
	deleteDepartmentById,
};

const departmentsController = require("../controllers/departments");
const authMiddleware = require("../middleware/auth_middleware");
const express = require("express");

const router = express.Router();

router.get(
	"/getalldepartments",
	authMiddleware.verifyJWT,
	departmentsController.getAllDepartments,
);
router.get(
	"/getdepartmentbyid",
	authMiddleware.verifyJWT,
	departmentsController.getDepartmentById,
);
router.post(
	"/newdepartment",
	authMiddleware.verifyJWT,
	departmentsController.newDepartment,
);
router.post(
	"/deletedepartment",
	authMiddleware.verifyJWT,
	departmentsController.deleteDepartmentById,
);
router.patch(
	"updatedepartment",
	authMiddleware.verifyJWT,
	departmentsController.updateDepartmentById,
);

module.exports = router;
